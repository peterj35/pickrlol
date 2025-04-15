import { useAuth0 } from '@auth0/auth0-react'
import { IChoice, ITopicComment } from '@ovo/data-api'
import cryptoRandomString from 'crypto-random-string'
import { ComponentPropsWithoutRef, useMemo, useState } from 'react'
import styled from 'styled-components'
import { createTopicComment } from '../lib/comments/createTopicComment'
import { gapUnitPx } from '../theme'
import InlineLink from './InlineLink'
import { CenteredLoading } from './Loading'
import TopicCommentForm, {
  ITopicCommentFormSubmitPayload,
} from './TopicCommentForm'
import TopicComments from './TopicComments'

const generateNewCommentId = () =>
  cryptoRandomString({ length: 7, type: 'alphanumeric' })

interface ITopicCommentsContainerProps extends ComponentPropsWithoutRef<'div'> {
  topicId: string
  comments?: ITopicComment[]
  wonChoice?: IChoice
}

/**
 * Renders comments if there are any, and also renders a form for users
 * to add new comments if they're logged in.
 */
const TopicCommentsContainer: React.FC<ITopicCommentsContainerProps> = ({
  topicId,
  comments,
  wonChoice,
  children,
  ...props
}) => {
  const { user, isLoading: isUserLoading, loginWithRedirect } = useAuth0()
  const userSub = user?.sub as string | undefined
  const userNickname = user?.nickname

  const [isCommentSubmitting, setIsCommentSubmitting] = useState<boolean>(false)
  const [submittedComment, setSubmittedComment] = useState<
    ITopicComment | undefined
  >(undefined)

  const allUnarchivedComments = useMemo(() => {
    const allComments = submittedComment
      ? [submittedComment, ...(comments || [])]
      : comments
    return allComments?.filter((comment) => !comment.isArchived)
  }, [comments, submittedComment])

  const areCommentsPresent = Boolean(allUnarchivedComments?.length)
  const doesUserHaveComment = allUnarchivedComments?.some(
    (comment) => comment.creatorId === userSub
  )
  const isUserLoggedIn = Boolean(userSub)

  const isLoading = isUserLoading || isCommentSubmitting

  const handleCommentFormSubmit = (
    formData: ITopicCommentFormSubmitPayload
  ) => {
    if (!userSub || !wonChoice) {
      throw new Error('Error while creating a comment')
    }
    const topicComment = {
      id: generateNewCommentId(),
      body: formData.body,
      creatorName: formData.name,
      creatorId: userSub,
      topicId,
      wonChoiceId: wonChoice.id,
      wonChoiceName: wonChoice.name,
    }
    setIsCommentSubmitting(true)
    createTopicComment(topicComment)
      .then(() => {
        const mockedTopicComment: ITopicComment = {
          ...topicComment,
          createdAtTimestamp: Date.now(),
          upvotes: 0,
          isArchived: false,
        }
        setSubmittedComment(mockedTopicComment)
      })
      .catch((err) => {
        alert(`There was an error submitting your comment: ${err}`)
      })
      .finally(() => {
        setIsCommentSubmitting(false)
      })
  }

  return (
    <div {...props}>
      <SectionHeader>
        Comments{' '}
        {areCommentsPresent ? `(${allUnarchivedComments!.length})` : null}
      </SectionHeader>
      {isLoading ? (
        <CenteredLoading size="large" />
      ) : !isUserLoggedIn ? (
        <LoginPromptContainer>
          You must be{' '}
          <InlineLink onClick={loginWithRedirect}>logged in</InlineLink> to
          comment.
        </LoginPromptContainer>
      ) : !doesUserHaveComment &&
        typeof wonChoice !== 'undefined' &&
        typeof userSub !== 'undefined' ? (
        <StyledTopicCommentForm
          userId={userSub}
          defaultUserName={userNickname}
          onCommentFormSubmit={handleCommentFormSubmit}
        />
      ) : null}
      {areCommentsPresent && allUnarchivedComments ? (
        <TopicComments comments={allUnarchivedComments} />
      ) : (
        <div>
          {/* TODO: mention that you can comment after you've played */}
          There are no comments yet! Start the discussion?{' '}
          {!isUserLoggedIn ? <>It takes less than a minute to signup.</> : null}
        </div>
      )}
      {children}
    </div>
  )
}

const SectionHeader = styled.h2`
  margin-top: 0;
`

const LoginPromptContainer = styled.div`
  margin-bottom: ${gapUnitPx * 2}px;
`

const StyledTopicCommentForm = styled(TopicCommentForm)`
  margin: ${gapUnitPx * 4}px 0;
`

export default TopicCommentsContainer
