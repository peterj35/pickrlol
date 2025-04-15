import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'

type GridGap = 'small'

interface ITilesProps extends ComponentPropsWithoutRef<'div'> {
  columns: number
  gridGap?: GridGap
}

const Tiles: React.FC<ITilesProps> = ({
  gridGap,
  columns,
  children,
  ...props
}) => {
  const gridGapPx = gridGap === 'small' ? 8 : 0

  return (
    <Grid columns={columns} gridGapPx={gridGapPx} {...props}>
      {children}
    </Grid>
  )
}

const Grid = styled.div<{ columns: number; gridGapPx: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  grid-auto-rows: 200px;
  grid-gap: ${({ gridGapPx }) => gridGapPx}px;
`

export default Tiles
