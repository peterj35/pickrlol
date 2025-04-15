import { useCallback, useMemo } from 'react'
import { UPVOTED_COMMENTS_STORE_KEY } from '../lib/localStorage'
import useLocalStorage from './useLocalStorage'

/**
 * CommentId to 'upvotedness'
 */
type CommentUpvotedStore = Record<string, boolean | undefined>

/**
 * Keep track on a per-device basis whether the user has upvoted a comment
 * or not. For a given commentId, returns a boolean based on the local store
 * whether the comment had been upvoted or not.
 *
 * This is to simplify the current upvote implementation to prevent
 * upvote spamming, but also allow upvoting by unlogged in users. Currently,
 * lean towards allowing upvotes rather than being restrictive.
 */
const useUpvotedCommentStore = (
  commentId: string
): [boolean, (didUpvote: boolean) => void] => {
  const [
    upvotedCommentsStore,
    setUpvotedCommentsStore,
  ] = useLocalStorage<CommentUpvotedStore>(UPVOTED_COMMENTS_STORE_KEY, {})

  const upvotedComment = useMemo(
    () => Boolean(upvotedCommentsStore[commentId]),
    [commentId, upvotedCommentsStore]
  )

  const setUpvotedComment = useCallback(
    (didUpvote: boolean) => {
      setUpvotedCommentsStore({
        ...upvotedCommentsStore,
        [commentId]: didUpvote ? true : undefined,
      })
    },
    [commentId, setUpvotedCommentsStore, upvotedCommentsStore]
  )

  return [upvotedComment, setUpvotedComment]
}

export default useUpvotedCommentStore
