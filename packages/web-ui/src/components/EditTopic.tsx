import { TextField, Chip } from '@material-ui/core'
import { ChoicesRecord, IChoice, ITopic, Tag } from '@ovo/data-api'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getChoicesList, getNewChoice } from '../lib/choice'
import ChoicePreviewTile from './ChoiceTile/Preview'
import ImageUpload from './ImageUpload'
import Tiles from './Tiles'
import Button from './Button'
import Toast from './Toast'
import styled from 'styled-components'
import { gapUnitPx } from '../theme'
import { MAX_CHOICE_NAME_LENGTH, topicSchema } from '../schema'
import { removeExtension } from '../lib/file'
import { getShortId } from '../lib/id'
import TagAutoCompleteInput from './TagAutoCompleteInput'
import { useGetIsFeatureEnabled } from '../lib/featureFlags/getIsFeatureEnabled'

const maxTagCount = 1

interface IEditTopicProps {
  topic?: ITopic
  userId: string
  canEditChoiceimages: boolean
  onSubmit: (topic: ITopic) => void
}

type FormValidityInfo = {
  /** unique ID of the input, such as name, description */
  id: string
  /** if the errorMsg is defined, there is an error */
  errorMsg?: string
  /** conditionally display validity (eg. only if user has interacted with the form field) */
  isVisible?: boolean
}

/**
 * @param topic is optional, and if omitted, will behave as a `NewTopic` component
 */
const EditTopic: React.FC<IEditTopicProps> = ({
  topic,
  canEditChoiceimages,
  userId,
  onSubmit,
}) => {
  /**
   * Form input states
   */
  const [name, setName] = useState(topic?.name || '')
  const [description, setDescription] = useState(topic?.description || '')
  const [choices, setChoices] = useState<IChoice[]>(
    topic?.choiceIds && topic?.choices
      ? getChoicesList(topic.choiceIds, topic.choices)
      : []
  )

  const [tagNames, setTagNames] = useState<string[]>(topic?.tagNames || [])

  /**
   * Form validation state
   */
  const [validity, setValidity] = useState<FormValidityInfo[]>([])

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setName(e.currentTarget.value)
    },
    []
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setDescription(e.currentTarget.value)
    },
    []
  )

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const choices: IChoice[] = []

      if (e.target.files) {
        Array.from(e.target.files).forEach((file: File) => {
          const mediaSrc = URL.createObjectURL(file)
          const mediaFile = file
          if (!mediaSrc) {
            // TODO: display some feedback to the user
            return
          }

          const newChoice = getNewChoice({
            mediaSrc,
            mediaFile,
            name: removeExtension(file.name),
          })

          choices.push(newChoice)
        })
      }

      if (choices.length) {
        setChoices((prev) => [...prev, ...choices])
      }
    },
    []
  )

  const handleRemoveImage = useCallback((choiceId: string) => {
    setChoices((prev) => {
      return prev.filter((choice) => {
        return choice.id !== choiceId
      })
    })
  }, [])

  const handlePreviewNameChange = useCallback(
    (choiceId: string, value: string) => {
      setChoices((prev) =>
        prev.map((choice) => {
          if (choice.id !== choiceId) {
            return choice
          }

          return {
            ...choice,
            name: value,
          }
        })
      )
    },
    []
  )

  useEffect(() => {
    const nameError = topicSchema.validate({ name }).error
    const descriptionError = topicSchema.validate({ description }).error
    const choicesError = topicSchema.validate({ choices }).error

    setValidity((prev) => [
      {
        id: 'name',
        errorMsg: nameError?.message,
        isVisible: prev.find((v) => v.id === 'name')?.isVisible || false,
      },
      {
        id: 'description',
        errorMsg: descriptionError?.message,
        isVisible: prev.find((v) => v.id === 'description')?.isVisible || false,
      },
      {
        id: 'choice',
        errorMsg: choicesError?.message,
        isVisible: prev.find((v) => v.id === 'choice')?.isVisible || false,
      },
      ...choices.map((choice, index) => {
        const choiceNameId = `choiceName${index}`
        const choiceNameError = topicSchema.validate({
          choiceName: choice.name,
        }).error
        return {
          id: choiceNameId,
          errorMsg: choiceNameError
            ? `Your choice name '${choice.name}' is too long, at ${choice.name.length} chars. (Max: ${MAX_CHOICE_NAME_LENGTH} characters)`
            : undefined,
          isVisible:
            prev.find((v) => v.id === choiceNameId)?.isVisible || false,
        }
      }),
    ])
  }, [choices, description, name])

  const isValid = useMemo(
    () => !validity.find((v) => typeof v.errorMsg === 'string'),
    [validity]
  )

  const handleSubmitButtonClick = useCallback(() => {
    if (!isValid) {
      // Make all form errors visible
      setValidity((prev) =>
        prev.map((validationInfo) => ({ ...validationInfo, isVisible: true }))
      )
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
      return
    }

    const choicesRecord = choices.reduce(
      (record: ChoicesRecord, choice) => ({ ...record, [choice.id]: choice }),
      {}
    )

    const updatedTopic: ITopic = {
      id: topic?.id || getShortId(),
      name,
      // IMPROVE: use serverside timestamping and not clientside
      createdAtTimestamp: topic?.createdAtTimestamp || Date.now(),
      description,
      choiceIds: choices.map((c) => c.id),
      choices: choicesRecord,
      creatorId: topic?.creatorId || userId,
      isArchived: false,
      comments: topic?.comments || [],
      tagNames,
    }

    onSubmit(updatedTopic)
  }, [
    isValid,
    choices,
    topic?.id,
    topic?.createdAtTimestamp,
    topic?.creatorId,
    topic?.comments,
    name,
    description,
    userId,
    tagNames,
    onSubmit,
  ])

  const visibleErrorMessages: string[] = useMemo(
    () =>
      validity
        .filter((v) => typeof v.errorMsg === 'string' && v.isVisible)
        .map((error) => error.errorMsg) as string[],
    [validity]
  )

  const inputHasError = useCallback(
    (inputId: string) => {
      const validityItem = validity.find((v) => v.id === inputId)
      return Boolean(validityItem?.errorMsg) && validityItem?.isVisible
    },
    [validity]
  )

  const handleTextFieldBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const id = e.target.id
      const idIndex = validity.findIndex((v) => v.id === id)

      if (idIndex === -1) {
        return
      }

      const nextValidity = [...validity]
      nextValidity[idIndex] = {
        ...nextValidity[idIndex],
        isVisible: true,
      }

      setValidity(nextValidity)
    },
    [validity]
  )

  const handleTagSelect = (tag: Tag) => {
    if (!tagNames.includes(tag.name)) {
      setTagNames((p) => [...p, tag.name])
    }
  }

  const handleTagCreate = (tagName: string) => {
    // TODO: limit chars to https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html
    if (tagNames.includes(tagName)) {
      return
    }

    setTagNames((p) => [...p, tagName])
  }

  const isCreateTagsEnabled = useGetIsFeatureEnabled('createTags')

  return (
    <EditTopicContainer>
      {visibleErrorMessages.length ? (
        <Toast
          label="Please fix these issues to create the topic"
          messages={visibleErrorMessages}
        />
      ) : null}
      <TextField
        id="name"
        label="Title"
        placeholder="Topic Title"
        helperText=""
        fullWidth
        value={name}
        onChange={handleTitleChange}
        onBlur={handleTextFieldBlur}
        error={inputHasError('name')}
        variant="outlined"
      />
      <TextField
        id="description"
        label="Description"
        placeholder="Topic Description"
        helperText=""
        fullWidth
        multiline
        rows={5}
        value={description}
        onChange={handleDescriptionChange}
        onBlur={handleTextFieldBlur}
        error={inputHasError('description')}
        variant="outlined"
      />
      <SpacedContentContainer>
        {isCreateTagsEnabled ? (
          <div>
            <h2>Tags</h2>
            <div>
              {tagNames.map((t) => {
                const handleDelete = () => {
                  setTagNames((p) =>
                    p.filter((existingTag) => existingTag !== t)
                  )
                }
                return <Chip key={t} label={t} onDelete={handleDelete} />
              })}
            </div>
            <TagInputContainer>
              <TagAutoCompleteInput
                onTagSelect={handleTagSelect}
                onTagCreate={handleTagCreate}
                isDisabled={tagNames.length >= maxTagCount}
              />
            </TagInputContainer>
          </div>
        ) : null}
      </SpacedContentContainer>
      <SpacedContentContainer>
        <h2>Choices</h2>
        <div>
          Upload 4 to 64 images or gifs that people will vote upon
          {choices.length ? ` (${choices.length} uploaded)` : null}
        </div>
        <div>
          <ImageUpload multiple onChange={handleImageUpload} />
        </div>

        <Tiles columns={2}>
          {choices.map((choice, index) => {
            const handleTileNameChange = (name: string) => {
              handlePreviewNameChange(choice.id, name)
            }

            const handleDeleteImage = () => {
              handleRemoveImage(choice.id)
            }

            return (
              <ChoicePreviewTile
                key={choice.id}
                choice={choice}
                onNameChange={handleTileNameChange}
                onDeleteImage={handleDeleteImage}
                canRemove={canEditChoiceimages}
                hasError={inputHasError(`choiceName${index}`)}
              />
            )
          })}
        </Tiles>
      </SpacedContentContainer>
      <Button onClick={handleSubmitButtonClick}>Submit!</Button>
    </EditTopicContainer>
  )
}

const EditTopicContainer = styled.div`
  & > div {
    margin-bottom: ${gapUnitPx * 12}px;
  }
`

const SpacedContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${gapUnitPx * 4}px;
`

const TagInputContainer = styled.div`
  & > div {
    margin-bottom: ${gapUnitPx * 2}px;
  }
`

export default EditTopic
