import * as React from 'react';
import { Avatar, Container, CssBaseline, Paper, Box, Grid, Button, CircularProgress } from '@mui/material';

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { mdTheme } from '../config/theme_config';
import Router from "next/router";
import { ApolloClientType, ChildParam } from '../store/Interface';
import { useAppDispatch, useAppSelector } from '../store/store';
import { getAllChildInfo, getSingleChildInfo } from '../store/thunk/childThunk';
import Auth from '../config/auth';
import { setListLoading } from '../store/slices/childSlice';
import { logout, parentLogout } from '../store/slices/userSlice';

function SelectProfile() {

  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector((state) => state.apolloClientReducer);
  const { childListData, isListLoading } = useAppSelector((state) => state.childReducer);
  const lastSelectedChild = localStorage.getItem("last-selected-child")

  React.useEffect(() => {
    dispatch(setListLoading(true));
    dispatch(getAllChildInfo(userClient));
  }, [])

  React.useEffect(() => {
    if (childListData && childListData.length > 0) {
      if (lastSelectedChild) {
        let childData = childListData.filter(val => val.child_id == lastSelectedChild);
        setSelectedChild(childData[0]);
      } else {
        setSelectedChild(childListData[0]);
      }
    }
  }, [childListData])

  const [selectedChild, setSelectedChild] = React.useState<ChildParam>();

  const goToDashboard = () => {
    if (typeof window !== "undefined" && selectedChild) {
      window.localStorage.setItem(
        'child_id',
        JSON.stringify(Number(selectedChild?.child_id))
      );
      localStorage.removeItem('last-selected-child')
      localStorage.setItem(
        "profile_pic",
        selectedChild.profile_image_url ? selectedChild.profile_image_url : "");
      Router.replace("/lesson-library");
    }
  }

  const handleSelectAvatar = (event: any, child: ChildParam) => {
    setSelectedChild(child)
    if (event.detail === 2) {
      goToDashboard();
    }
  }

  const goToParentPortal = () => {
    Router.replace("/parentportal");
  }

  const ProfileSidebar = () => {
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
        <Container maxWidth="xs" sx={{ position: { md: "fixed" } }} >
          <Typography component="h1" variant="h4" className="header-h4 welcom-text">
            Always remember!
          </Typography>
          {/* <Typography component="h1" variant="h5" className="header-h5 second-header">
            Instant Access To 1,000+ Maths Videos And Lession
          </Typography> */}
          <Typography component="p" className="login-text">
            That today, and everyday...<br />
            You are clever,<br />
            You are important,<br />
            You are gifted,<br />
            You are perfectly imperfect just the way you are,<br />
            And you can do anything you<br />
            set your mind to... ANYTHING!<br />
          </Typography>
          <div className='logo'>
            <img src="/images/logo.png" alt="logo" className={"logo"} />
          </div>
        </Container>

      </Grid>
    )
  }

  const handleLogout = () => {
     dispatch(logout());
     dispatch(parentLogout());
     Router.replace("/");
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <ProfileSidebar />
        <Grid item xs={12} sm={12} md={6} component={Paper} className="login-form-container" elevation={6} square>
          <Box
            className='container-box'
            sx={{
              my: 2,
              mx: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: "center"
            }}
          >
            <Container maxWidth="xs" className="profile-container" >
              <Typography component="p" className="header-title">
                Welcome Back
              </Typography>
              <Typography component="p" className="header-subtitle">
                Hope you&#39;re having a brilliant day
              </Typography>
              {
                isListLoading ? (
                  <Box
                    sx={{
                      my: 4,
                      mx: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (

                  <Box
                    sx={{
                      my: 4,
                      mx: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                    className="form-element"
                  >
                    <Grid container spacing={1} className='avatar-container'>
                      {
                        childListData && childListData.length > 0 &&
                        childListData.map((child: ChildParam, index: number) => (
                          <Grid item md={6} sm={6} xs={12} key={index} justifyContent={"center"} className="inner-avatar-container">
                            <Avatar onClick={(e) => handleSelectAvatar(e, child)} className={(selectedChild?.child_id == child.child_id) ? 'user-avatar user-profile-selected' : 'user-avatar'} alt="Nikunj Solanki" src={child.profile_image_url} />
                            <Typography component={"p"} variant={'caption'} className="textfield-label">
                              {child.child_name}
                            </Typography>
                          </Grid>

                        ))
                      }
                      {/* <Grid item md={6} sm={6} xs={12} className="inner-avatar-container">
                    <Avatar onClick={()=>handleSelectAvatar(2)} className={(selectedUser == 2) ? 'user-avatar user-profile-selected' : 'user-avatar'} alt="Prihaan Solanki" src="/images/img2.png" />
                    <Typography component={"p"} variant={'caption'} className="textfield-label">Prihaan Solanki</Typography>
                  </Grid> */}
                    </Grid>
                    <Grid container spacing={1} justifyContent="center">
                      <Grid item md={12} sm={12} xs={12}>
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          onClick={goToDashboard}
                          sx={{ mt: 4, pt: 1, pb: 1 }}
                        >
                          Let&apos;s Start Learning
                        </Button>
                      </Grid>
                      <Grid item md={8} sm={8} xs={8}>
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          onClick={goToParentPortal}
                          sx={{ mt: 4, py: 1 }}
                        >
                          Enter Parent Portal
                        </Button>
                      </Grid>
                      <Grid item md={6} sm={6} xs={6}>
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          onClick={handleLogout}
                          sx={{ mt: 4, py: 1 }}
                        >
                          Logout
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )
              }
            </Container>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Auth(SelectProfile); 
