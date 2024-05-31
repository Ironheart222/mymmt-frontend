import React, { SyntheticEvent } from "react";
import { Snackbar, Alert } from "@mui/material";
type paramsStatus = {
  msg: string;
  status: string;
};
const Notification = (params: paramsStatus) => {

  const [open, setOpen] = React.useState(true);
  const handleClose = (event: SyntheticEvent | Event, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <main>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        // autoHideDuration={6000}
        onClose={handleClose}
      >
      
        <Alert severity={params.status === "success" ? "success" : "error"}>
            {params.msg}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Notification;
