import { useMemo } from 'react'
import {
  CopyToClipboard as ReactCopyToClipboard,
  Options as ReactCopyToClipboardOptions,
} from 'react-copy-to-clipboard'

const defaultCopyToClipboardOptions: ReactCopyToClipboardOptions = {
  format: 'text/plain',
}

export interface ICopyToClipboardProps {
  text: string
  onCopy?(text: string, result: boolean): void
  options?: ReactCopyToClipboardOptions
}

const CopyToClipboard: React.FC<ICopyToClipboardProps> = ({
  text,
  options,
  onCopy,
  children,
  ...props
}) => {
  const opts = useMemo(
    () => ({ ...defaultCopyToClipboardOptions, ...options }),
    [options]
  )

  return (
    <ReactCopyToClipboard text={text} options={opts} onCopy={onCopy} {...props}>
      {children}
    </ReactCopyToClipboard>
  )
}

export default CopyToClipboard
