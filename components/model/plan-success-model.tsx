import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { Box } from "@mui/system";
import * as React from "react";

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export default function PlanSuccessModel(props: Props) {
    let { open, onClose } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={'paper'}
            maxWidth={"sm"}>

            <DialogContent>
                <Box sx={{ m: 2, display:"flex", flexDirection:"column", textAlign: "center"}}>
                    <div>
                        <DoneRoundedIcon className="Success-icon" />
                    </div>
                    <br/>
                    <div>
                        <Typography variant='h6' component={"p"}>
                            Payment Successful.
                        </Typography>
                    </div>
                    <div>
                        <Typography variant='subtitle2' component={"p"}>
                            You have successfully purchased a subscription plan.
                        </Typography>
                    </div>
                    <br/>
                    <div>
                        <Button variant="outlined" onClick={onClose}>GOT IT</Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}