import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { Email } from '@mui/icons-material';
import Validations from "../../helpers/validations";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import { sendLinkToNewEmail } from "../../store/thunk/parentThunk";
import Router from "next/router";

interface Props {
    open: boolean,
    parent_id: string | undefined,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

interface FormType {
    email: string,
    confirm_email: string
}

export default function EditEmailModel(props: Props) {
    let { open, onClose, parent_id } = props;

    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)

    const [formData, setFormData] = React.useState<FormType>({
        email: "",
        confirm_email: ""
    });
    const [formError, setFormError] = React.useState<Partial<FormType>>({
        email: "",
        confirm_email: ""
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleChange = (prop: keyof FormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [prop]: event.target.value });
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        let reqParams = {
            email: formData.email.trim(),
            confirm_email: formData.confirm_email.trim(),
            parent_id: parent_id ? parent_id : ""
        }

        let allError = Validations.validateModalEmail(reqParams);

        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            let _request = {
                new_email: reqParams.email,
                parent_id: reqParams.parent_id
            }
            setLoading(true);
            dispatch(sendLinkToNewEmail({
                _request, userClient, result: (res: any) => {
                    setLoading(false);
                    if (res.status == "true") {
                        onClose(event);
                        Router.replace(`/email-verification?parent_id=${parent_id}&&email=${reqParams.email}`);
                    }
                }
            }))
        }
        setFormError(allError);

    };

    return (
        <Dialog
            open={open}
            scroll={'paper'}
            maxWidth={"md"}
            className="dialog-container">
            <DialogContent>
                <Box sx={{ m: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div>
                        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                            Changing your primary account email
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            There is no problem changing the email linked to your account.<br />
                            Please note: you will immediately be sent a new verification email and until that new email is confirmed you will not (nor will any of the students on your account ) have acccess to the platform.
                        </Typography>
                    </div>
                    <br />
                    <div>
                        <Grid container spacing={1}>
                            <Grid item md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    type="email"
                                    name='email'
                                    className="model-textfield"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    autoComplete="none"
                                    placeholder="Enter new email address"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoFocus
                                    error={formError && formError.email ? true : false}
                                    helperText={formError && formError.email}
                                />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    type="email"
                                    name='confirm email'
                                    className="model-textfield"
                                    value={formData.confirm_email}
                                    onChange={handleChange('confirm_email')}
                                    autoComplete="none"
                                    placeholder="Confirm new email address"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                    autoFocus
                                    error={formError && formError.confirm_email ? true : false}
                                    helperText={formError && formError.confirm_email}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <br />
                    <div>
                        <Stack direction={"row"} justifyContent="center" spacing={2}>
                            <Button variant="contained" className="dialog-ok-button" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" className="dialog-ok-button" onClick={handleSubmit}>
                                {
                                    loading ?
                                        (<CircularProgress color={"inherit"} size={20} />) :
                                        "Change my email"
                                }

                            </Button>
                        </Stack>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )
}