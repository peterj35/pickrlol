import { IconButton, Tooltip } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CopyToClipboard, { ICopyToClipboardProps } from './CopyToClipboard'
import FileCopyIcon from '@material-ui/icons/FileCopy'

const COPIED_FEEDBACK_TIMEOUT_MS = 2500

interface ICopyToClipboardButtonProps extends ICopyToClipboardProps {}

const CopyToClipboardButton: React.FC<ICopyToClipboardButtonProps> = ({
  text,
  onCopy: onCopyCb,
  options,
}) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false)
  const hasCopiedFeedbackTimeoutRef = useRef<number | undefined>(undefined)
  const handleCopyToClipboardCopy = useCallback(
    (text, res) => {
      setHasCopied(true)

      if (hasCopiedFeedbackTimeoutRef.current) {
        clearTimeout(hasCopiedFeedbackTimeoutRef.current)
      }

      hasCopiedFeedbackTimeoutRef.current = (setTimeout(() => {
        setHasCopied(false)
      }, COPIED_FEEDBACK_TIMEOUT_MS) as unknown) as number

      if (onCopyCb) {
        onCopyCb(text, res)
      }
    },
    [onCopyCb]
  )

  useEffect(
    () => () => {
      clearTimeout(hasCopiedFeedbackTimeoutRef.current)
    },
    []
  )

  return (
    <CopyToClipboard
      text={text}
      onCopy={handleCopyToClipboardCopy}
      options={options}
    >
      <Tooltip
        title={
          hasCopied
            ? `Link copied! Go and share it`
            : `Copy topic link to clipboard`
        }
      >
        <IconButton aria-label="Copy link" size="small">
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton
