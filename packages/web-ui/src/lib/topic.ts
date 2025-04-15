import {
  ChoicesRecord,
  IChoice,
  ITopic,
  IUpdateTopicPayload,
} from '@ovo/data-api'
import axios from 'axios'
import { isLocalImage, uploadImage } from './images'

const API_ENDPOINT_TOPICS = process.env.REACT_APP_API_ENDPOINT_TOPICS

if (!API_ENDPOINT_TOPICS) {
  throw new Error('one or more env vars undefined')
}

export type TopicsUserParams = {
  deviceId: string
  userId?: string
}

export const fetchTopic = async (id: string, params: TopicsUserParams) => {
  const response = await axios.get(`${API_ENDPOINT_TOPICS}/${id}`, { params })
  return response.data as ITopic
}

export const fetchTopics = async (
  params: TopicsUserParams,
  tagNames?: string[]
) => {
  const response = await axios.get(API_ENDPOINT_TOPICS, {
    params: {
      ...params,
      tags: tagNames,
    },
    // turns tags[]=a&tags[]=b to tags=a&tags=b
    paramsSerializer: {
      indexes: null,
    },
  })
  return response.data as ITopic[]
}

interface ICreateTopicProps {
  topic: ITopic
  onImageUploadComplete: (currIndex: number, total: number) => void
}

export const postTopic = async ({
  topic,
  onImageUploadComplete,
}: ICreateTopicProps) => {
  const numChoices = Object.entries(topic.choices).length
  let currentChoiceIdx = 0

  /**
   * IMPROVE @peterj35: Image uploads can be done in parallel.
   *
   * Refactor image upload progress as well to reflect num of items that have
   * been completed, instead of per image index
   */
  for (const [choiceId, choice] of Object.entries(topic.choices)) {
    if (!choice) {
      throw new Error('Choice was undefined')
    }
    const { largeRemoteUrl, thumbRemoteUrl } = await uploadImage(
      choiceId,
      choice.mediaFile
    )
    choice.mediaSrc = largeRemoteUrl
    choice.thumbMediaSrc = thumbRemoteUrl

    onImageUploadComplete(currentChoiceIdx, numChoices)
    currentChoiceIdx++
  }

  await axios.post(API_ENDPOINT_TOPICS, {
    topic,
  })
}

export const updateTopic = async (
  topicId: string,
  updatedTopic: IUpdateTopicPayload,
  params: TopicsUserParams
) => {
  for (const [choiceId, choice] of Object.entries(updatedTopic.choices)) {
    if (!choice) {
      throw new Error('Choice was undefined')
    }
    if (isLocalImage(choice.mediaSrc)) {
      const { largeRemoteUrl, thumbRemoteUrl } = await uploadImage(
        choiceId,
        choice.mediaFile
      )
      choice.mediaSrc = largeRemoteUrl
      choice.thumbMediaSrc = thumbRemoteUrl
    }
  }
  await axios.put(`${API_ENDPOINT_TOPICS}/${topicId}`, updatedTopic, { params })
}

export const getTopChoices = (choices: ChoicesRecord, count = 3): IChoice[] => {
  const choicesArr = Object.keys(choices).map((k) => choices[k]) as IChoice[]
  const topChoices = choicesArr
    .sort((a, b) => b.record.totalWinCount - a.record.totalWinCount)
    .slice(0, count)
  return topChoices
}

export const getTotalPlayedCount = (topic: ITopic) => {
  let totalPlayedCount = 0

  Object.values(topic.choices).forEach((choice) => {
    if (!choice) {
      return
    }

    const { totalWinCount } = choice?.record
    totalPlayedCount += totalWinCount
  })

  return totalPlayedCount
}
