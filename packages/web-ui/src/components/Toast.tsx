import { ComponentPropsWithoutRef } from 'react'
import styled from 'styled-components'
import {
  borderRadiusPx,
  gapUnitPx,
  white,
  smallFontPx,
  lightRed,
} from '../theme'

interface IToastProps extends ComponentPropsWithoutRef<'div'> {
  label?: string
  messages: string[]
}

const Toast: React.FC<IToastProps> = ({ label, messages, ...props }) => (
  <ToastContainer {...props}>
    {label ? <ToastLabel>{label}</ToastLabel> : null}
    <ToastList>
      {messages.map((message, index) => (
        <MessageItem key={index}>{message}</MessageItem>
      ))}
    </ToastList>
  </ToastContainer>
)

const ToastContainer = styled.div`
  text-align: left;
  background-color: ${lightRed};
  border-radius: ${borderRadiusPx}px;
  padding: ${gapUnitPx / 2}px;
  font-size: ${smallFontPx}px;
  color: ${white};
`

const ToastLabel = styled.h4`
  text-align: center;
`

const ToastList = styled.ul`
  margin: ${gapUnitPx * 2}px 0;
  list-style: square;
`

const MessageItem = styled.li`
  margin: ${gapUnitPx}px 0;
`

export default Toast
