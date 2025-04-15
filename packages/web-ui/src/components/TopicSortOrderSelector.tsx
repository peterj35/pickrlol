import { ComponentPropsWithoutRef } from 'react'
import {
  orderToLabel,
  topicSummarySortOrder,
  TopicSummarySortOrder,
} from '../lib/topicSummary'
import styled from 'styled-components'
import { gapUnitPx } from '../theme'
import { ActivatableChip } from './ActivatableChip'

interface ITopicSortOrderSelectorProps extends ComponentPropsWithoutRef<'div'> {
  active: TopicSummarySortOrder
  onOrderChange: (value: TopicSummarySortOrder) => void
}

const TopicSortOrderSelector: React.FC<ITopicSortOrderSelectorProps> = ({
  active,
  onOrderChange,
  ...props
}) => (
  <Container {...props}>
    {topicSummarySortOrder.map((order) => {
      const onChipClick: React.MouseEventHandler<HTMLDivElement> = () => {
        onOrderChange(order)
      }
      return (
        <ActivatableChip
          key={order}
          id={order}
          label={orderToLabel[order]}
          onClick={onChipClick}
          color={order === active ? 'primary' : 'default'}
        />
      )
    })}
  </Container>
)

const Container = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-auto-flow: column;
  grid-gap: ${gapUnitPx * 4}px;
`

export default TopicSortOrderSelector
