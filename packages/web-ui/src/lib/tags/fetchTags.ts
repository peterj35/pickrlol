import { Tag } from '@ovo/data-api'
import axios from 'axios'

const API_ENDPOINT_TAGS = process.env.REACT_APP_API_ENDPOINT_TAGS

if (!API_ENDPOINT_TAGS) {
  throw new Error('one or more env vars undefined')
}

export const fetchTags = async () =>
  (await axios.get(API_ENDPOINT_TAGS)).data as Tag[]
