import * as React from 'react';
import { Container, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function RegisterSideBar() {
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
        justifyContent: "center",
        px: 2,        
        py: 12
      }}
    >
      <Container maxWidth="xs" sx={{ position: { md:"fixed"} }}>
        <Typography component="h1" variant="h4" className="header-h4 welcom-text">
          Welcome!
        </Typography>
        <Typography component="h1" variant="h5" className="header-h5 second-header">
          You&#39;re only minutes away from  accessing the learning portal.
        </Typography>
        <Typography component="p" className="login-text">
          Simply fill out your details to set up your account and within minutes your children will have access to the full learning portal.
        </Typography>
        <div className='logo'>
          <img src="/images/logo.png" alt="logo" className={"logo"} />
        </div>
      </Container>
    </Grid>
  );
}