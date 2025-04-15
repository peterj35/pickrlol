import React from 'react'
import Button from './Button'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export interface IAlertDialogProps extends Partial<DialogProps> {
  title?: string
  isVisible: boolean
  content: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

const AlertDialog: React.FC<IAlertDialogProps> = ({
  title,
  content,
  onConfirm: onConfirmCb,
  onCancel: onCancelCb,
  confirmText = 'Yes',
  cancelText = 'No',
  isVisible,
  children,
  ...props
}) => (
  <Dialog
    open={isVisible}
    onClose={onCancelCb}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    {...props}
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {content}
      </DialogContentText>
      {children}
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirmCb}>{confirmText}</Button>
      <Button onClick={onCancelCb}>{cancelText}</Button>
    </DialogActions>
  </Dialog>
)

export default AlertDialog
