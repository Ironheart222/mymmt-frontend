import Head from 'next/head';
import NextLink from 'next/link';
import { Box, Button, Container, CssBaseline, Grid, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LinkExpired = () => (
    <Grid container component="main" justifyContent={"center"} sx={{ height: "100vh" }}>
        <CssBaseline />
        {/* <LoginSideBar /> */}
        <Box
            sx={{
                my: 6,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
            }}>

            <img src="/images/link-expired.png" alt="logo" className='expired-logo' />

            <Typography component="h5" variant="h5" sx={{ m: 1 }}>
                RESET PASSWORD LINK EXPIRED
            </Typography>

            <Typography component="p" sx={{ m: 1 }}>
                Hi, It look like you&apos;re too late to reset your account password. <br />
                But don&apos;t worry, you can regenerate your reset password link.
            </Typography>

        </Box>
    </Grid>
);

export default LinkExpired;
