import { Tag } from '../../tags'
import { queryTag } from './queryTag'

type TagExistence = 'doesExist' | 'doesNotExist' | 'isArchived'

export const getDoesTagExist = async (
  tagsTableName: string,
  tagName: string
): Promise<TagExistence> => {
  const tags = await queryTag<Tag>(tagsTableName, tagName)

  if (!tags.length) {
    return 'doesNotExist'
  }

  if (tags[0].isArchived) {
    return 'isArchived'
  }

  return 'doesExist'
}
