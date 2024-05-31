import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default function AddStudentPopup(props: Props) {
    let { open, onClose } = props;

    return (
        <Dialog
            open={open}
            scroll={'paper'}
            maxWidth={"sm"}
            className="dialog-container">

            <DialogContent>
                <Box sx={{ m: 2, display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div>
                        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                            You need to create a Student Profile
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            To enter the Learning Portal you need to
                            create at least one student profile
                            <br />
                            <br />
                            Please select the ‘Add Student’ button to complete this process
                        </Typography>
                    </div>
                    <br />
                    <div>
                        <Button variant="contained" className="dialog-ok-button" onClick={onClose}>
                            Got It
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}