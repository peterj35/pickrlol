import { TextField } from '@material-ui/core'
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { commentSchema } from '../schema/comment'
import { SmallButton, SmallTertiaryButton } from './Button'
import styled from 'styled-components'
import { gapUnitPx } from '../theme'

const defaultTitle = 'Add new comment'

export interface ITopicCommentFormSubmitPayload {
  name: string
  body: string
}

interface ITopicCommentFormProps extends ComponentPropsWithoutRef<'div'> {
  userId: string
  defaultUserName?: string
  defaultBody?: string
  title?: string
  onCommentFormSubmit: (payload: ITopicCommentFormSubmitPayload) => void
  onCancelClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const TopicCommentForm: React.FC<ITopicCommentFormProps> = ({
  title = defaultTitle,
  userId,
  defaultUserName,
  defaultBody,
  onCommentFormSubmit,
  onCancelClick,
  children,
  ...props
}) => {
  const [isBodyFieldFocused, setIsBodyFieldFocused] = useState<boolean>(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(commentSchema),
    defaultValues: {
      name: defaultUserName,
      body: defaultBody,
    },
  })

  const handleBodyFieldFocus = () => {
    clearTimeout((timeoutRef.current as unknown) as number)
    setIsBodyFieldFocused(true)
  }

  const handleBodyFieldBlur = () => {
    timeoutRef.current = setTimeout(() => {
      setIsBodyFieldFocused(false)
    }, 300)
  }

  useEffect(() => {
    return () => {
      clearTimeout((timeoutRef.current as unknown) as number)
    }
  }, [])

  return (
    <div {...props}>
      <Title>{title}</Title>
      <form onSubmit={handleSubmit(onCommentFormSubmit)}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="dense"
          error={Boolean(errors.name?.message)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Body (max 120 chars)"
          variant="outlined"
          fullWidth
          margin="dense"
          multiline
          rows={isBodyFieldFocused ? 5 : 2}
          error={Boolean(errors.body?.message)}
          helperText={errors.body?.message}
          onFocus={handleBodyFieldFocus}
          onBlurCapture={handleBodyFieldBlur}
          {...register('body')}
        />
        <RightAlignedContainer>
          {typeof onCancelClick === 'function' ? (
            <SmallTertiaryButton onClick={onCancelClick}>
              Cancel
            </SmallTertiaryButton>
          ) : null}
          <SmallButton type="submit">Submit</SmallButton>
        </RightAlignedContainer>
      </form>

      {children}
    </div>
  )
}

const Title = styled.div`
  margin-bottom: ${gapUnitPx * 2}px;
`

const RightAlignedContainer = styled.div`
  display: flex;
  justify-content: right;

  & > button:not(:last-child) {
    margin-right: ${gapUnitPx}px;
  }
`

export default TopicCommentForm
