import * as React from "react";
// import  from '@mui/material/Button';
// import  from '@mui/material/Dialog';
// import  from '@mui/material/DialogActions';
// import  from '@mui/material/DialogContent';
// import  from '@mui/material/DialogContentText';
// import  from '@mui/material/DialogTitle';
// import  from '@mui/material/Slide';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface modalInterface {
  open: boolean;
  handleClose: () => void;
  title?: string | React.ReactElement;
  content?: string | React.ReactElement;
  onConfirm?: (e: React.MouseEvent) => void;
  onCancel?: (e: React.MouseEvent) => void;
}

export default function CustomModal({
  open,
  handleClose,
  title = "Confirm",
  content = "Are you sure you want to delete this",
  onConfirm = (e) => {},
  onCancel = (e) => {},
}: modalInterface) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            onCancel(e);
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            onConfirm(e);
            handleClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
