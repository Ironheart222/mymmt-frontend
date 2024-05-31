import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default function UserSubscribeModel(props: Props) {
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
                            Welcome to the Learning Portal
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            To proceed you will need to complete the setup of your account by selecting a membership plan and creating a student profile(s). 
                            create at least one student profile
                            <br />
                            <br />
                            The setup should only take a few minutes. Thank you.
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