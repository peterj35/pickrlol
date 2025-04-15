import { AWSError } from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { Tag } from '../../tags'
import { deletePutItem } from '../db/deletePutItem'
import { queryTag } from './queryTag'

export const modifyTagUsedCount = async (
  tagsTableName: string,
  operation: 'add' | 'remove',
  tagName: string,
  topicIds: string[]
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> => {
  const tags = await queryTag<Tag>(tagsTableName, tagName)
  const tag = tags[0]

  if (!tag) {
    throw new Error(
      `Cannot modifyTagUsedCount for tag with name ${tagName} as it doesn't exist`
    )
  }

  const nextUsedCount =
    operation === 'add'
      ? tag.usedCount + topicIds.length
      : tag.usedCount - topicIds.length

  const nextTopicIds =
    operation === 'add'
      ? [...new Set([...tag.topicIds, ...topicIds])]
      : tag.topicIds.filter((t) => topicIds.includes(t))

  const nextTag: Tag = {
    ...tag,
    usedCount: nextUsedCount,
    topicIds: nextTopicIds,
  }

  /*
    We cannot use `UpdateItem` to update primary key attributes, which
    in this case is the usedCount.
    
    Instead, we must delete the item, and then put a new item.
  */
  return await deletePutItem<Tag>({
    tableName: tagsTableName,
    key: { name: tag.name, usedCount: tag.usedCount },
    item: nextTag,
  })
}
