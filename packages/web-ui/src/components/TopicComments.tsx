import { ITopicComment } from '@ovo/data-api'
import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import { gapUnitPx } from '../theme'
import TopicComment from './TopicComment'

interface ITopicCommentsProps extends ComponentPropsWithoutRef<'div'> {
  comments: ITopicComment[]
}

const TopicComments: React.FC<ITopicCommentsProps> = ({
  comments,
  ...props
}) => {
  return (
    <Container {...props}>
      {comments.map((comment) => (
        <TopicComment key={comment.id} comment={comment} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  > div {
    margin-bottom: ${gapUnitPx * 2}px;
  }
`

export default TopicComments
