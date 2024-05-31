import * as React from 'react';
import { Container, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function LoginSideBar() {
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
          The more you learn, the more things you&#39;ll know.
          The more that you learn, the more places you&#39;ll go.
          <br/>
          <span style={{float: "right", marginRight: "18px"}}>Dr Seuss</span>
        </Typography>
        <div className='logo'>
          <img src="/images/logo.png" alt="logo" className={"logo"} />
        </div>
      </Container>

    </Grid>
  );
}