import { Tag } from '../../tags'
import { createTag } from './createTag'
import { getDoesTagExist } from './getDoesTagExist'
import { modifyTagUsedCount } from './modifyTagUsedCount'

type CreateOrIncrementTagProps = {
  tableName: string
  tagName: string
  creatorId: string
  topicIds: string[]
}

export const createOrIncrementTag = async ({
  tableName,
  tagName,
  creatorId,
  topicIds,
}: CreateOrIncrementTagProps): Promise<void> => {
  const doesTagExist = await getDoesTagExist(tableName, tagName)

  if (doesTagExist === 'isArchived') {
    throw new Error(
      `Could not create or increment tag ${tagName} because it is archived.`
    )
  } else if (doesTagExist === 'doesExist') {
    await modifyTagUsedCount(tableName, 'add', tagName, topicIds)
  } else if (doesTagExist === 'doesNotExist') {
    const newTag: Tag = {
      name: tagName,
      createdAtTimestamp: Date.now(),
      usedCount: topicIds.length,
      creatorId,
      isArchived: false,
      topicIds,
    }
    await createTag(tableName, newTag)
  }
}
