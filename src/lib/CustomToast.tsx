import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import type { ToastDataType } from "./CustomToastContext";

interface toastInterface extends ToastDataType {
  close: () => void;
  hideDuration?: number;
}

const CustomToast = (props: toastInterface) => {
  const {
    open,
    close,
    message,
    type,
    hideDuration = 6000,
    anchorOrigin,
  } = props;

  return (
    <>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={hideDuration}
          onClose={close}
          anchorOrigin={
            anchorOrigin
              ? anchorOrigin
              : {
                  vertical: "top",
                  horizontal: "center",
                }
          }
        >
          <Alert
            onClose={close}
            variant="filled"
            severity={type}
            sx={{ color: type === "success" ? "white" : "" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

CustomToast.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  message: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  anchorOrigin: PropTypes.object,
};

export default CustomToast;
