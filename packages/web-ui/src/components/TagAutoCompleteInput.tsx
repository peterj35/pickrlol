import { Tag } from '@ovo/data-api'
import Autocomplete, {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteCloseReason,
  AutocompleteInputChangeReason,
} from '@material-ui/lab/Autocomplete'
import { Popper, TextField } from '@material-ui/core'
import { useState } from 'react'
import styled from 'styled-components'
import { useFetchTags } from '../hooks/useFetchTags'
import { tagSchema } from '../schema/tag'

type TagAutoCompleteInputProps = {
  onTagSelect: (tag: Tag) => void
  onTagCreate: (tagName: string) => void
  isDisabled: boolean
  isPopoverDismissedOnBlur?: boolean
}

const TagAutoCompleteInput: React.FC<TagAutoCompleteInputProps> = ({
  onTagSelect,
  onTagCreate,
  isDisabled,
  isPopoverDismissedOnBlur = false,
}) => {
  const tags = useFetchTags()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleInputClose = (
    event: React.ChangeEvent<{}>,
    reason: AutocompleteCloseReason
  ) => {
    if (reason === 'blur' && !isPopoverDismissedOnBlur) {
      return
    }

    setIsOpen(false)
  }

  const handleInputOpen = () => {
    setIsOpen(true)
  }

  const handleInputChange = (
    event: React.ChangeEvent<{}>,
    value: string | Tag | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Tag> | undefined
  ) => {
    if (error) {
      return
    }

    if (reason === 'select-option') {
      if (typeof value !== 'object' || value === null) {
        console.error(
          `An unknown error occurred, expected Tag object but got ${value}`
        )
        return
      }
      onTagSelect(value)
      setInputValue('')
    }

    if (reason === 'create-option') {
      if (typeof value !== 'string') {
        console.error(
          `An unknown error occurred, expected tag name string but got ${value}`
        )
        return
      }
      onTagCreate(value)
    }
  }

  const handleTextInputChange = (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    const err = tagSchema.validate({ name: value }).error
    if (err?.message !== error) {
      setError(err?.message || '')
    }

    setInputValue(value)
  }

  return (
    <div>
      {error ? <div>{error}</div> : null}
      <Autocomplete
        open={isOpen}
        freeSolo
        disableListWrap
        options={tags.sort((a, b) => b.usedCount - a.usedCount)}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : `${option.name.toString()} (${option.usedCount})`
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tag Name" />
        )}
        noOptionsText={`value (Add new tag)`}
        PopperComponent={({ style, ...props }) => (
          <StyledPopper {...props} style={{ ...style }} />
        )}
        size="small"
        onOpen={handleInputOpen}
        onClose={handleInputClose}
        onChange={handleInputChange}
        onInputChange={handleTextInputChange}
        inputValue={inputValue}
        disabled={isDisabled}
      />
    </div>
  )
}

const StyledPopper = styled(Popper)`
  li {
    margin: 0;
    padding: 0 4px;
  }
`

export default TagAutoCompleteInput
