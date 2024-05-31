import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, CircularProgress, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { Email } from '@mui/icons-material';
import { ApolloClientType, PasswordType } from '../../store/Interface';
import { useAppDispatch, useAppSelector } from '../../store/store';
import Validations from '../../helpers/validations';
import { forgotPassword } from '../../store/thunk/parentThunk';

interface Props {
    open: boolean,
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface FormValidation {
    email?: string;
}

interface RequestType {
    email: string;
    password_type: PasswordType
}

export default function ParentForgotPassword(props: Props) {

    let { open, onClose } = props;

    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);

    const [email, setEmail] = React.useState("");
    const [formError, setFormError] = React.useState<FormValidation>({});
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false)
        }
    }, [notificationInfo])

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        let _request: RequestType = {
            email: email,
            password_type: PasswordType.SETTING_PASSWORD
        }
        let allError = Validations.validateForgotPasswordForm(_request);
        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            setLoading(true);
            Promise.resolve(
                dispatch(forgotPassword({ _request, userClient }))
            ).then(res => {
                setLoading(true);
                onClose(event);
            })
        }
        setFormError(allError);
    }


    return (
        <Dialog
            open={open}
            scroll={'paper'}
            maxWidth={"sm"}
            className="dialog-container">
            <DialogContent>
                <Box sx={{ m: 1, display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div>
                        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                            Forgotten Password
                        </Typography>
                    </div>
                    <div>
                        <Typography component="p" className="login-text">
                            Forgotten your password, no problem. Please enter your email here and we will send you a link to reset it.
                        </Typography>
                    </div>
                    <br />
                    <div>
                        <Grid container spacing={1}>
                            <Grid item md={12} sm={12} xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="email"
                                    type="email"
                                    className="forgot-password-textfield"
                                    placeholder='Enter email address'
                                    onChange={(event) => setEmail(event.target.value)}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={formError && formError.email ? true : false}
                                    helperText={formError && formError.email}
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
                            <Button
                                type="button"
                                variant="contained" 
                                className="dialog-ok-button"
                                onClick={handleSubmit}
                                disabled={loading ? true : false}
                            >
                                {
                                    loading ?
                                        (<CircularProgress color={"inherit"} size={20} />) :
                                        "Reset my password"
                                }
                            </Button>
                        </Stack>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
