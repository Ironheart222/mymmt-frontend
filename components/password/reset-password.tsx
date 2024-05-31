import * as React from 'react';
import { Box, Button, Container, CssBaseline, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, TextField, Typography } from '@mui/material';
import { Lock, VisibilityOff, Visibility } from '@mui/icons-material';
import Validations from '../../helpers/validations';

interface State {
    password: string;
    cPassword: string;
    showPassword: boolean;
    showCPassword: boolean;
}

interface FormValidation {
    password?: string;
    cPassword?: string;
}

const ResetPasswordLayout = () => {

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
            cPassword: values.cPassword
        }
        let allError = Validations.validateResetPasswordForm(reqParams);
        if (
            Object.entries(allError).length === 0 &&
            allError.constructor === Object
        ) {
            // dispatch(createLogin(reqParams));
        }
        setFormError(allError);
    }

    return (

        <Grid container component="main" justifyContent={"center"} sx={{ height: "100vh" }}>
            <CssBaseline />
            {/* <LoginSideBar /> */}
            <Grid item xs={12} sm={8} md={6} component={Paper} className="login-form-container" elevation={6} square sx={{ m: 4, borderRadius: 3, width: "20vw" }}>
                <Box
                    sx={{
                        my: 6,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    {/* <div className='logo'> */}
                    <img src="/images/logo.png" alt="logo" className={"reset-logo"} />
                    {/* </div> */}
                    <Typography component="h1" variant="h5" className="header-h5">
                        Reset Password
                    </Typography>
                    <Typography component="p" className="header-text">
                        Please, Enter your new Password and confirm password below
                    </Typography>
                    <Box component="form" className="form-element" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <InputLabel className="textfield-label">Password</InputLabel>
                        <OutlinedInput
                            required
                            fullWidth
                            type={values.showPassword ? 'text' : 'password'}
                            placeholder="Password"
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
                        >
                            Reset Password
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>

    )
}

export default ResetPasswordLayout;
