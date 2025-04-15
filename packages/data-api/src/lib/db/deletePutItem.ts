import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { deleteItem } from './deleteItem'
import { putItem } from './putItem'

type DeletePutItemProps<T> = {
  tableName: string
  key: DocumentClient.Key
  item: T
}

/**
 * deletePutItem -- updateItem involving primary keys
 *
 * For update operations involving primary key attributes, we cannot update the
 * index key.
 *
 * This method will delete the existing item, and then put a new item.
 *
 * @throws - Exception if the item targeted for deletion could not be found.
 */
export const deletePutItem = async <
  T extends DocumentClient.PutItemInputAttributeMap
>({
  tableName,
  key,
  item,
}: DeletePutItemProps<T>) => {
  const deleteResp = await deleteItem({
    tableName,
    key,
  })

  /*
    Do not write a new item if the old item wasn't found,
    it may have been updated by another operation, and so
    this transaction is not safe.
  */
  if (!deleteResp.Attributes) {
    throw new Error(
      'deletePutItem failed because the expected original object was not found, and therefore could not be cleaned up'
    )
  }

  return await putItem(tableName, item)
}
