import { Tag } from '@ovo/data-api'
import { useState, useEffect } from 'react'
import { fetchTags } from '../lib/tags/fetchTags'

export const useFetchTags = (): Tag[] => {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    const getAndSetTags = async () => {
      const allTags = await fetchTags()
      setTags(allTags)
    }

    getAndSetTags()
  }, [])

  return tags
}
