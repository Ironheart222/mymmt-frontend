import * as React from 'react';
import { Container, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function VerifiedEmailSidebar(props: any) {
    let { title, subtitle, paragraph } = props.sidebarDetails;
    
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
                alignItems: "center",
                px: 2
            }}
        >
            <Container maxWidth="xs" sx={{ py: 4 }}>
                <Typography component="h1" variant="h4" className="header-h4 welcom-text">
                    {title}
                </Typography>
                <Typography component="h1" variant="h5" className="header-h5 second-header">
                    {subtitle}
                </Typography>
                <Typography component="p" className="login-text">
                    {paragraph}
                </Typography>
                <div className='logo'>
                    <img src="/images/logo.png" alt="logo" className={"logo"} />
                </div>
            </Container>

        </Grid>
    );
}