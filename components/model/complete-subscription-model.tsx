import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import Router from "next/router";

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default function CompleteSubscriptionModel(props: Props) {
    let { open, onClose } = props;

    const handleOnClick = () => {
        Router.replace("/parentportal");
    }

    return (
        <Dialog
            open={open}
            // onClose={onClose}
            scroll={'paper'}
            maxWidth={"md"}
            className="dialog-container">
            <DialogContent>
                <Box sx={{ m: 2, display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div>
                        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                            Congratulations, your subscription is done
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            All we need to do is setup your student profiles and you&#39;re good to go.
                        </Typography>
                    </div>
                    <br />
                    <div>
                        <Button variant="contained" className="dialog-ok-button" onClick={handleOnClick}>
                            Student Profiles
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}