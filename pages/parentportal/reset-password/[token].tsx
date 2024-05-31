import Head from 'next/head';
import * as React from 'react';
import { Box, Button, CircularProgress, Container, CssBaseline, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../../../config/theme_config';
import LoginSideBar from '../../../components/login-sidebar';
import { Lock, VisibilityOff, Visibility } from '@mui/icons-material';
import Validations from '../../../helpers/validations';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { isLinkExpire } from '../../../store/thunk/userThunk';
import { ApolloClientType, PasswordType, ResetPassword } from '../../../store/Interface';
import LinkExpired from '../../../components/link-expired';
import { resetPassword } from '../../../store/thunk/parentThunk';

interface State {
    password: string;
    cPassword: string;
    showPassword: boolean;
    showCPassword: boolean;
    token: string
}

interface FormValidation {
    password?: string;
    cPassword?: string;
}

function ResetPassword() {
    const dispatch = useAppDispatch();
    const { linkEpireData } = useAppSelector((state) => state.userReducer);
    const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer)
    const notificationInfo = useAppSelector((state) => state.notificationReducer);
    const { resetPasswordData } = useAppSelector((state) => state.parentReducer);
    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (notificationInfo) {
            setLoading(false);
        }
    }, [notificationInfo])

    const router = useRouter();
    const { token }: any = router.query;

    React.useEffect(() => {
        if (token) {
            dispatch(isLinkExpire({ _request: token, userClient }));
        }
    }, [token])

    const [values, setValues] = React.useState({
        password: '',
        cPassword: '',
        showPassword: false,
        showCPassword: false
    });
    const [formError, setFormError] = React.useState<FormValidation>();

    const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let reqParams: Partial<State> = {
            password: values.password,
            cPassword: values.cPassword,
        }
        let allError = Validations.validateResetPasswordForm(reqParams);
        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            let params: ResetPassword = {
                password: values.password,
                token: token ? token : "",
                password_type: PasswordType.SETTING_PASSWORD
            }
            setLoading(true);
            dispatch(resetPassword({ _request: params, userClient }));
        }
        setFormError(allError);
    }

    const Sidebar = () => {
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
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "center",
                    px: 2
                }}
            >
                <Container maxWidth="xs" sx={{ py: 4 }}>
                    <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                        Welcome back!
                    </Typography>
                    <Typography component="h1" variant="h5" className="header-h5 second-header">
                        Let&apos;s learn something new today
                    </Typography>
                    <Typography component="p" className="login-text">
                        Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been The Industry’s Standard dummy text ever since The 1500S, When an unknown printer took a galley of type and scrambled
                    </Typography>
                    <div className='logo'>
                        <img src="/images/logo.png" alt="logo" className={"logo"} />
                    </div>
                </Container>

            </Grid>
        )
    }

    return (
        <>
            <Head>
                <title>
                    Reset Password
                </title>
            </Head>
            <ThemeProvider theme={mdTheme}>
                {
                    linkEpireData && linkEpireData.data.isExpired ? LinkExpired() :

                        <Grid container component="main" sx={{ height: '100vh' }}>
                            <CssBaseline />
                            <Sidebar />
                            <Grid item xs={12} sm={12} md={6} component={Paper} className="login-form-container" elevation={6} square>
                                <Box
                                    sx={{
                                        my: 8,
                                        mx: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minWidth: "80%"
                                    }}>
                                    <Typography component="h1" variant="h5" className="header-title">
                                        Reset parent password
                                    </Typography>
                                    <Typography component="p" className="header-subtitle">
                                        You are about to reset you parental access password
                                    </Typography>
                                    <Box component="form" className="form-element" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                        <InputLabel className="textfield-label">New Password</InputLabel>
                                        <OutlinedInput
                                            required
                                            fullWidth
                                            type={values.showPassword ? 'text' : 'password'}
                                            placeholder="New Password"
                                            value={values.password}
                                            onChange={handleChange('password')}
                                            error={formError && formError.password ? true : false}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Lock />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {
                                            formError && formError.password && (
                                                <FormHelperText error id="password-error">
                                                    {formError.password}
                                                </FormHelperText>
                                            )
                                        }
                                        <InputLabel className="textfield-label">Confirm Password</InputLabel>
                                        <OutlinedInput
                                            required
                                            fullWidth
                                            type={values.showCPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            value={values.cPassword}
                                            onChange={handleChange('cPassword')}
                                            error={formError && formError.cPassword ? true : false}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <Lock />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setValues({ ...values, showCPassword: !values.showCPassword })}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {values.showCPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                        {
                                            formError && formError.cPassword && (
                                                <FormHelperText error id="password-error">
                                                    {formError.cPassword}
                                                </FormHelperText>
                                            )
                                        }
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 4, pt: 1, pb: 1 }}
                                            disabled={loading ? true : false}
                                        >
                                            Reset Parent Access Password
                                            {loading && <CircularProgress color={"primary"} size={20} />}
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                }
            </ThemeProvider>
        </>

    )
}

export default ResetPassword;
