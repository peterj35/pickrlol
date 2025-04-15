import { Tag } from '@ovo/data-api'
import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import useIsLTEML from '../hooks/useIsLTEML'
import { gapUnitPx } from '../theme'
import { ActivatableChip } from './ActivatableChip'
import { TILE_TABLET_WIDTH_PX } from './Topics'

export const collapsedMaxHeightPx = 36

type TagFilterSelectorProps = {
  tags: Tag[]
  activeTagNames: string[]
  isCollapsed: boolean
  onTagChange: (nextActiveTagNames: string[]) => void
} & ComponentPropsWithoutRef<'div'>

const TagFilterSelector: React.FC<TagFilterSelectorProps> = ({
  tags,
  activeTagNames,
  isCollapsed,
  onTagChange,
  ...props
}) => {
  const hasActiveTags = activeTagNames.length > 0

  const handleSelectNone = () => {
    onTagChange([])
  }

  const isLTEML = useIsLTEML()

  return (
    <Container isMobile={isLTEML} {...props}>
      <TagsContainer isMobile={isLTEML} isCollapsed={isCollapsed}>
        {tags.map((t) => {
          const handleTagClick = () => {
            const nextActiveTagNames = activeTagNames.includes(t.name)
              ? activeTagNames.filter((tagName) => tagName !== t.name)
              : [...activeTagNames, t.name]

            onTagChange(nextActiveTagNames)
          }

          return (
            <ActivatableChip
              key={t.name}
              label={t.name}
              color={activeTagNames.includes(t.name) ? 'primary' : 'default'}
              onClick={handleTagClick}
            />
          )
        })}
      </TagsContainer>
      <ActivatableChip
        disabled={!hasActiveTags}
        label="Clear Selection"
        onClick={handleSelectNone}
      />
    </Container>
  )
}

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${gapUnitPx}px;
  max-width: ${({ isMobile }) =>
    isMobile ? TILE_TABLET_WIDTH_PX : TILE_TABLET_WIDTH_PX * 2}px;

  margin-left: auto;
  margin-right: auto;
`

const TagsContainer = styled.div<{ isMobile: boolean; isCollapsed: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${gapUnitPx}px;

  ${({ isCollapsed, isMobile }) =>
    isCollapsed &&
    `
    height: ${collapsedMaxHeightPx}px;
    overflow-x: scroll;
    flex-wrap: nowrap;

    max-width: ${isMobile ? TILE_TABLET_WIDTH_PX : TILE_TABLET_WIDTH_PX * 2}px;
    `}
`

export default TagFilterSelector
