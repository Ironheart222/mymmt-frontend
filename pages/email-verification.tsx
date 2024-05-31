import Head from 'next/head';
import * as React from 'react';
import { Box, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../config/theme_config';
import { logout, parentLogout } from '../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useRouter } from 'next/router';
import { ApolloClientType } from '../store/Interface';
import { setLoading } from '../store/slices/loadingSlice';
import { resendEmail } from '../store/thunk/userThunk';
import { sendLinkToNewEmail } from '../store/thunk/parentThunk';

interface EmailVeriyType {
    title: string,
    message: string
}

const EditEmailVerification = () => {
    const dispatch = useAppDispatch();
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);

    const [emailId, setEmailId] = React.useState<string>("");
    const [parentID, setParentID] = React.useState<string>("");

    const router = useRouter();
    const { email, parent_id }: any = router.query;

    React.useEffect(() => {
        dispatch(logout());
        dispatch(parentLogout());
    }, []);

    React.useEffect(() => {
        setEmailId(email);
        setParentID(parent_id);
    }, [email, parent_id]);

    const handleClickResenMail = () => {
        if (emailId && parentID) {
            let _request = {
                new_email: emailId,
                parent_id: parentID
            }

            dispatch(setLoading(true));
            dispatch(sendLinkToNewEmail({
                _request, userClient, result: (res: any) => {
                    dispatch(setLoading(false));
                }
            }))
        }
    }

    const ResendEmailSidebar = () => {
        return (
            <Grid
                item
                xs={false}
                sm={12}
                md={6}
                sx={{
                    backgroundColor: "#000",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: "center",
                    alignItems: "center",
                }}
            >
                <Container maxWidth="sm" sx={{ alignItems: "center", px: 4, py: 4 }}>
                    <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                        Your primary email has been changed
                    </Typography>
                    <Typography component="h1" variant="h5" className="header-h5 second-header">
                        Please check your email to confirm your new email address.
                    </Typography>
                    <Typography component="p" className="login-text">
                        Once you confirm your email address you will be redirected to log back into your account.
                    </Typography>

                    <Typography component="p" className="link-text">
                        Didn&#39;t receive your confirmation email, <br />
                        please <span onClick={handleClickResenMail}><u>click here</u></span> to resend it
                    </Typography>
                    <div className='logo'>
                        <img src="/images/logo.png" alt="logo" className={"logo"} />
                    </div>
                </Container>

            </Grid>
        )
    }
    return (
        <ThemeProvider theme={mdTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <ResendEmailSidebar />
                <Grid item xs={12} sm={12} md={6} component={Paper} className="login-form-container" elevation={6} square>
                    <Box className="quotation-text-container" sx={{ p: { xs: 2, sm: 4, md: 4 } }}>
                        <Typography component="h1" variant="h6" className="quotation-text">
                            Education is the passport to the
                            future... for tomorrow belongs to
                            those who prepare for it today
                        </Typography>
                        <Typography component="h1" variant="subtitle2" className="author-text">
                            Malcolm X
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

        </ThemeProvider>
    )
};

export default EditEmailVerification;
