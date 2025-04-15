import { ITopic } from '@ovo/data-api'
import { ComponentPropsWithoutRef, Fragment, useRef } from 'react'
import { Layer, Stage, Text, Rect, Group } from 'react-konva'
import useStoredGameResult from '../../hooks/useStoredGameResult'
import { useElementSize } from 'usehooks-ts'
import { backgroundColorAccentSecondary, gapUnitPx } from '../../theme'
import CanvasImage from './CanvasImage'
import { getMediaUrl } from '../../lib/images'
import { SmallButton } from '../Button'
import Konva from 'konva'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'
import GetAppIcon from '@material-ui/icons/GetApp'
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser'

// See: https://stackoverflow.com/a/15832662/512042
const downloadURI = (uri: string, name: string) => {
  var link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

type GameHistoryCanvasImageProps = {
  topic: ITopic
} & ComponentPropsWithoutRef<'div'>

const GameHistoryCanvasImage: React.FC<GameHistoryCanvasImageProps> = ({
  topic,
  ...props
}) => {
  const [storedGameResult] = useStoredGameResult(topic.id)

  const [containerRef, { width }] = useElementSize()
  const stageRef = useRef<Konva.Stage>(null)

  if (!storedGameResult?.gameHistory) {
    console.warn(
      'Cannot render GameHistoryCanvasImage without stored game history'
    )
    return null
  }

  const longTitleThresholdChars = 50

  /**
   * The "title area"
   */
  const firstRoundOffsetPx =
    topic.name.length > longTitleThresholdChars ? 200 : 100

  const baseHeightPx = 50
  const matchHeightPx = 150

  /**
   * You must calculate offsets in advance
   */
  const roundOffsets: number[] = [
    ...storedGameResult.gameHistory
      .map((round) => {
        let roundChoicesCount = 0
        round.forEach((m) => {
          m.forEach(() => {
            roundChoicesCount++
          })
        })
        return baseHeightPx + Math.ceil(roundChoicesCount / 2) * matchHeightPx
      })
      .reduce(
        (acc, curr, i) => {
          let sum = acc[i] + curr

          if (
            storedGameResult.gameHistory?.length &&
            i === storedGameResult.gameHistory.length - 1
          ) {
            sum += 90
          }

          acc.push(sum)
          return acc
        },
        [firstRoundOffsetPx]
      ),
  ]

  /**
   * Last entry in roundOffsets is the final Y space
   */
  const canvasHeightPx = roundOffsets[roundOffsets.length - 1]

  const handleDownloadButtonClick = () => {
    if (!stageRef.current) {
      return
    }

    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
    downloadURI(uri, `${topic.name}.png`)
  }

  const handleOpenImageInNewTabClick = () => {
    if (!stageRef.current) {
      return
    }

    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })

    const img = new Image()
    img.src = uri

    const w = window.open('')
    w?.document.write(img.outerHTML)
  }

  return (
    <Container ref={containerRef} {...props}>
      <Stage width={width} height={canvasHeightPx} ref={stageRef}>
        <Layer>
          <Rect
            width={width}
            height={canvasHeightPx}
            fill="black"
            preventDefault={false}
          />
          <Text
            text={topic.name}
            fill="white"
            align="center"
            fontSize={28}
            width={width}
            padding={gapUnitPx * 4}
            fontFamily="Quicksand"
            fontStyle="bold"
            preventDefault={false}
          />
          {storedGameResult.gameHistory.map((round, i) => {
            const roundOfNum: number = round.reduce((sum, match) => {
              return sum + match.length
            }, 0)
            const isWinnerEntry = i + 1 === storedGameResult.gameHistory?.length
            return round.map((match, j) => {
              let xOffset = 0
              return (
                <Fragment key={j}>
                  <Group y={roundOffsets[i]}>
                    <Text
                      text={
                        isWinnerEntry
                          ? 'Winner'
                          : roundOfNum === 2
                          ? 'Finals'
                          : `Round of ${roundOfNum}`
                      }
                      fill="white"
                      align="center"
                      width={width}
                      x={xOffset}
                      fontSize={20}
                      fontFamily="Quicksand"
                      fontStyle="bold"
                      preventDefault={false}
                    />
                  </Group>
                  <Group y={roundOffsets[i] + j * matchHeightPx}>
                    {match.map((c, i) => {
                      xOffset = (width / 2) * i
                      const choice = topic.choices[c.id]

                      if (!choice) {
                        console.error('Could not get choice with ID', c.id)
                        return null
                      }
                      return (
                        <Group key={c.id} x={xOffset}>
                          {c.isWinner && !isWinnerEntry ? (
                            <Rect
                              y={30}
                              x={5}
                              width={width / 2 - 10}
                              height={matchHeightPx - 25}
                              stroke={backgroundColorAccentSecondary}
                              strokeWidth={3}
                              preventDefault={false}
                            />
                          ) : null}
                          <CanvasImage
                            src={getMediaUrl(choice.mediaSrc)}
                            x={10}
                            width={isWinnerEntry ? width - 20 : width / 2 - 20}
                            height={isWinnerEntry ? 140 : 80}
                            y={40}
                            preventDefault={false}
                          />
                          <Text
                            text={choice.name}
                            fill="white"
                            align="center"
                            width={isWinnerEntry ? width : width / 2}
                            y={isWinnerEntry ? 190 : 124}
                            fontSize={isWinnerEntry ? 24 : 18}
                            fontFamily="Quicksand"
                            fontStyle="bold"
                            preventDefault={false}
                          />
                        </Group>
                      )
                    })}
                  </Group>
                </Fragment>
              )
            })
          })}
          <Group y={canvasHeightPx - 24} x={width - 164}>
            <Text
              text="Made with"
              fill="white"
              width={width}
              fontSize={16}
              fontFamily="Quicksand"
              preventDefault={false}
            />
            <Text
              text="pickr.lol"
              fill={backgroundColorAccentSecondary}
              width={width}
              fontSize={20}
              fontStyle="bold"
              fontFamily="Quicksand"
              x={80}
              y={-3}
              preventDefault={false}
            />
          </Group>
        </Layer>
      </Stage>
      <SmallButton
        onClick={
          isMobile ? handleOpenImageInNewTabClick : handleDownloadButtonClick
        }
      >
        <DownloadButtonContent>
          {isMobile ? (
            <>
              <span>Open image in new tab (download)</span>{' '}
              <OpenInBrowserIcon />
            </>
          ) : (
            <>
              <span>Download result as PNG</span> <GetAppIcon />
            </>
          )}
        </DownloadButtonContent>
      </SmallButton>
    </Container>
  )
}

const Container = styled.div`
  & > *:not(:last-child) {
    margin-bottom: ${gapUnitPx * 4}px;
  }
`

const DownloadButtonContent = styled.div`
  display: flex;
  align-items: center;

  & > span {
    margin-right: ${gapUnitPx * 2}px;
  }
`

export default GameHistoryCanvasImage
