import { ITopicComment } from '@ovo/data-api'
import { ComponentPropsWithoutRef, useState } from 'react'
import styled from 'styled-components'
import {
  borderRadiusPx,
  gapUnitPx,
  lightGrey,
  smallFontPx,
  smallerFontPx,
} from '../theme'
import ago from 's-ago'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import useUpvotedCommentStore from '../hooks/useUpvotedCommentsStore'
import { modifyTopicCommentUpvote } from '../lib/comments/modifyTopicCommentUpvote'
import { CenteredLoading, TinyLoading } from './Loading'
import InlineLink from './InlineLink'
import { useAuth0 } from '@auth0/auth0-react'
import TopicCommentForm, {
  ITopicCommentFormSubmitPayload,
} from './TopicCommentForm'
import { updateTopicComment } from '../lib/comments/updateTopicComment'
import { archiveTopicComment } from '../lib/comments/archiveTopicComment'
import AlertDialog from './AlertDialog'

interface ITopicCommentProps extends ComponentPropsWithoutRef<'div'> {
  comment: ITopicComment
}

const TopicComment: React.FC<ITopicCommentProps> = ({ comment, ...props }) => {
  const { user } = useAuth0()
  const userSub = user?.sub

  /**
   * Prevents upvoting twice and persisting it on the same device
   */
  const [hasUpvoted, setHasUpvoted] = useUpvotedCommentStore(comment.id)
  const [localUpvote, setLocalUpvote] = useState<number>(comment.upvotes)
  const [
    isShowingUpvoteProcessing,
    setIsShowingUpvoteProcessing,
  ] = useState<boolean>(false)

  const [
    isShowingCommentProcessing,
    setIsShowingCommentProcessing,
  ] = useState<boolean>(false)

  const [isEditting, setIsEditting] = useState<boolean>(false)
  const [localBody, setLocalBody] = useState<string>(comment.body)

  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState<boolean>(
    false
  )
  const [isDeleted, setIsDeleted] = useState<boolean>(false)

  const handleUpvoteButtonClick = () => {
    const { topicId, id: commentId } = comment
    setIsShowingUpvoteProcessing(true)
    const modifier = hasUpvoted ? -1 : 1
    modifyTopicCommentUpvote({
      topicId,
      commentId,
      modifier,
    })
      .then(() => {
        setIsShowingUpvoteProcessing(false)
        setLocalUpvote((prev) => prev + modifier)
        setHasUpvoted(!hasUpvoted)
      })
      .catch((err) => {
        alert(
          `Had error ${err} while trying to submit your upvote, try again later`
        )
      })
  }

  const handleEditClick = () => {
    setIsEditting(true)
  }

  const handleFormCancelClick = () => {
    setIsEditting(false)
  }

  const handleEditSubmit = (data: ITopicCommentFormSubmitPayload) => {
    const { topicId, id } = comment

    setIsShowingCommentProcessing(true)
    updateTopicComment({
      topicId,
      id,
      creatorName: data.name,
      body: data.body,
    })
      .then(() => {
        setIsEditting(false)
        setLocalBody(data.body)
      })
      .catch((err) => {
        alert(
          `Had error ${err} while trying to edit your comment, try again later`
        )
      })
      .finally(() => {
        setIsShowingCommentProcessing(false)
      })
  }

  const handleDeleteClick = () => {
    setIsDeleteConfirmVisible(true)
  }

  const handleDeleteCancel = () => {
    setIsDeleteConfirmVisible(false)
  }

  const handleDeleteConfirm = () => {
    setIsDeleteConfirmVisible(false)

    const { topicId, id } = comment

    setIsShowingCommentProcessing(true)
    archiveTopicComment({
      topicId,
      id,
      userId: userSub,
    })
      .then(() => {
        setIsDeleted(true)
      })
      .catch((err) => {
        alert(
          `Had error ${err} while trying to delete your comment, try again later`
        )
      })
      .finally(() => {
        setIsShowingCommentProcessing(false)
      })
  }

  return (
    <>
      <Container {...props}>
        {isShowingCommentProcessing ? (
          <CenteredLoading size="large" />
        ) : isDeleted ? (
          <div>Your comment has been successfully deleted.</div>
        ) : isEditting ? (
          <div>
            <TopicCommentForm
              title="Edit comment"
              userId={userSub}
              defaultUserName={comment.creatorName}
              defaultBody={comment.body}
              onCancelClick={handleFormCancelClick}
              onCommentFormSubmit={handleEditSubmit}
            />
          </div>
        ) : (
          <>
            <CreatorName>{comment.creatorName}</CreatorName>
            <WonChoiceName>{comment.wonChoiceName}</WonChoiceName>
            <Body>{localBody}</Body>
            <ControlPanel>
              {comment.creatorId === userSub ? (
                <Controls>
                  <InlineLink onClick={handleEditClick}>Edit</InlineLink>
                  <InlineLink onClick={handleDeleteClick}>Delete</InlineLink>
                </Controls>
              ) : null}
              <Meta>
                <CreatedAt>
                  <span
                    title={`Created ${new Date(
                      comment.createdAtTimestamp
                    ).toUTCString()}${
                      comment.editedAtTimestamp
                        ? `, edited ${ago(new Date(comment.editedAtTimestamp))}`
                        : ''
                    }`}
                  >
                    {ago(new Date(comment.createdAtTimestamp))}
                  </span>
                </CreatedAt>
                <Upvotes>
                  {isShowingUpvoteProcessing ? (
                    <TinyLoading />
                  ) : (
                    <>
                      <span>{localUpvote + 1}</span>
                      <UpvoteButton onClick={handleUpvoteButtonClick}>
                        <KeyboardArrowUpIcon
                          color={hasUpvoted ? 'secondary' : 'primary'}
                        />
                      </UpvoteButton>
                    </>
                  )}
                </Upvotes>
              </Meta>
            </ControlPanel>
          </>
        )}
      </Container>
      <AlertDialog
        isVisible={isDeleteConfirmVisible}
        content={`Are you sure you want to delete your comment? This CANNOT be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}

const Container = styled.div`
  padding: ${gapUnitPx * 2}px;
  background-color: ${lightGrey};
  border-radius: ${borderRadiusPx}px;
  overflow-wrap: break-word;
`

const CreatorName = styled.div`
  font-weight: bold;
`

const WonChoiceName = styled.div`
  font-size: ${smallFontPx}px;
`

const Body = styled.div`
  margin: ${gapUnitPx * 2}px 0;
  font-size: ${smallFontPx}px;
`

const ControlPanel = styled.div`
  font-size: ${smallerFontPx}px;

  display: grid;
  grid-template-areas: 'controls meta';
`

const Controls = styled.div`
  grid-area: controls;

  display: flex;
  align-items: center;

  & > button:not(:last-child) {
    margin-right: ${gapUnitPx * 2}px;
  }
`

const Meta = styled.div`
  grid-area: meta;

  display: grid;
  grid-template-columns: auto 40px;
  grid-template-rows: 24px;
  justify-content: right;
  align-items: center;

  & > div:not(:last-child) {
    margin-right: ${gapUnitPx * 3}px;
  }
`

const Upvotes = styled.div`
  display: flex;
  align-items: center;
  justify-self: right;
`

const UpvoteButton = styled.button`
  display: contents;
`

const CreatedAt = styled.div``

export default TopicComment
