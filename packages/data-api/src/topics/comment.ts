/**
 * Describes a topic comment, a comment to a topic made by any user who has
 * a 'won choice'.
 *
 * Upvote restriction is done on the client side as to not clog up
 * document size limits here. In theory, an upvotedUserIds could be stored
 * and checked in order to allow the upvote or not.
 *
 * Downvotes are currently not supported, but should be done by
 * adding a new `downvotes` attribute.
 */
export interface ITopicComment {
  id: string
  topicId: string
  creatorId: string
  creatorName: string
  body: string
  createdAtTimestamp: number
  editedAtTimestamp?: number
  wonChoiceId: string
  wonChoiceName: string
  upvotes: number
  isArchived: boolean
}
