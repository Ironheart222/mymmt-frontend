import { Button, Dialog, DialogContent, DialogProps, DialogTitle, IconButton, Typography } from "@mui/material";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Box } from "@mui/system";
import * as React from "react";
import { styled, withStyles } from "@mui/styles";
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from "@mui/icons-material/Close";

interface Props {
    open: boolean,
    lesson: any
    onClose: () => void,
}
const StyledDialog = styled(Dialog)<any>(({ theme }) => ({
    backdropFilter: "blur(5px)",
    position: 'fixed',
    zIndex: '7 !important',
    right: '0px',
    bottom: '0px',
    top: '0px',
    left: '0px',
    [theme.breakpoints.up('lg')]: {
        left: '270px'
    }
}));

export default function LockLessonModel(props: Props) {
    let { open, onClose, lesson } = props;

    return (
        <StyledDialog
            open={open}
            className="dialog-container"
            scroll={'paper'}
            maxWidth={"sm"}>

            <DialogTitle>
                <IconButton
                    sx={{ float: "right" }}
                    onClick={() => onClose()}
                    aria-label="close">
                    <CloseIcon fontSize="small" sx={{color: "#99fc31"}}/>
                </IconButton>

            </DialogTitle>

            <DialogContent>
                <Box sx={{ m: 2, display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div>
                        <LockIcon className="Success-icon" />
                    </div>
                    <br />
                    <div>
                        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                            {`Lesson ${lesson.lesson_no} is locked`}
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            All lessons need to be watched in order.
                            <br />
                            Please complete the previous lesson to unlock this lesson.
                        </Typography>
                    </div>
                    <br />
                </Box>
            </DialogContent>
        </StyledDialog>
    )
}