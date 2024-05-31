import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../config/theme_config';
import { Box, Button, Container, CssBaseline, Grid, Paper, Stack, Typography } from '@mui/material';
import Router from 'next/router';
import { logout, parentLogout } from '../store/slices/userSlice';
import { useAppDispatch } from '../store/store';
import config from '../config/config';

function ParentLogoutLayout() {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(logout());
        dispatch(parentLogout());
    }, []);

    const handleGoToLogin = () => {
        Router.replace("/");
    }

    const handleGoToHomePage = () => {
        Router.replace(`${config.HOME_PAGE_URL}`)
    }

    const ParentLogoutSidebar = () => {
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
                    px: 2
                }}
            >
                <Container maxWidth="sm" sx={{ alignItems: "center", py: 4 }}>
                    <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                        You have successfully logged out
                    </Typography>
                    <Typography component="p" className="login-text" sx={{ maxWidth: "26rem" }}>
                        Our mission is the liberation of your child’s
                        human spirit by empowering them with
                        the capability, competence and
                        confidence to achieve whatever
                        they desire.
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
            <Grid container sx={{ height: '100vh' }}>
                <CssBaseline />
                <ParentLogoutSidebar />
                <Grid item xs={12} sm={12} md={6} component={Paper} className="login-form-container" elevation={6} square>
                    <Box className="quotation-text-container" sx={{ my: { xs: 6, sm: 8, md: 10 }, p: { xs: 2, sm: 4, md: 4 } }}>
                        <Typography component="h1" variant="h6" className="citation-text">
                            Every child is one caring adult away
                            from being a success story
                        </Typography>
                        <Typography component="p" className="login-text" textAlign={"center"} sx={{ mt: 1 }}>
                            Thank you for being that adult
                        </Typography>

                        <Stack direction={"row"} justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                            <Button variant="contained" className="dialog-ok-button" onClick={handleGoToHomePage}>
                                Home
                            </Button>
                            <Button variant="contained" className="dialog-ok-button" onClick={handleGoToLogin}>
                                Login
                            </Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>

        </ThemeProvider >
    )
}

export default ParentLogoutLayout;