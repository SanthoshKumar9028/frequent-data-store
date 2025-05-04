import { Alert, AlertProps, Snackbar } from "@mui/material";
import { useState } from "react";

export const useSnackBar = () => {
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [snackBarMessage, setSnackBarMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertProps["severity"]>("success");

  return {
    openSnackBar: ({
      msg,
      severity,
    }: {
      msg: string;
      severity?: AlertProps["severity"];
    }) => {
      setOpenSnackBar(true);
      setSnackBarMessage(msg);
      if (severity) setSeverity(severity);
    },
    snackBar: (
      <Snackbar
        open={openSnackBar}
        onClose={() => {
          setOpenSnackBar(false);
        }}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={snackBarMessage}
      >
        <Alert severity={severity}>{snackBarMessage}</Alert>
      </Snackbar>
    ),
  };
};
