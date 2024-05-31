import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default function AddChildCompleteModel(props: Props) {
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
                            Congratulations, you&#39;re all set
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            To start your child’s learning journey simply close this message and
                            select the Enter Learning Portal button above
                            <br />
                            <br />
                            Or if you need to create another student profile, simply close
                            this message and add another student
                        </Typography>
                    </div>
                    <br />
                    <div>
                        <Button variant="contained" className="dialog-ok-button" onClick={onClose}>
                            Got it
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}