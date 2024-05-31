import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../../config/theme_config";
import {
  Backdrop,
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LoginSideBar from "../../components/Register-sidebar";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import { useRouter } from "next/router";
import { resendEmail, updateSubcription } from "../../store/thunk/userThunk";
import { setLoading } from "../../store/slices/loadingSlice";
import SignUpLayout from "../../components/signup/signup-layout";

function ResendEmailLayout() {
  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const [emailId, setEmailId] = React.useState<string>("");

  const router = useRouter();
  const { email, subscription_id }: any = router.query;

  React.useEffect(() => {
    setEmailId(email);
  }, [email]);

  // Removed Updation
  /* React.useEffect(() => {
    if (subscription_id) {
      let _request = {
        subscriptions_id: subscription_id,
      };

      dispatch(
        updateSubcription({
          _request,
          userClient,
          result: (res: any) => {
            console.log("res");
          },
        })
      );
    }
  }, [subscription_id]); */

  const handleClickResenMail = () => {
    if (emailId) {
      let _request = {
        email: emailId,
      };

      dispatch(setLoading(true));
      dispatch(resendEmail({ _request, userClient }));
    }
  };

  const ResendEmailSidebar = () => {
    return (
      <Grid
        item
        xs={false}
        sm={12}
        md={12}
        sx={{
          backgroundColor: "#000",
          my: 8,
          mx: 4,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          m: 0,
          backgroundImage: `url(${"../images/sign-up-pricing-background.jpg"})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Container maxWidth="sm" sx={{ alignItems: "center", px: 4, py: 4 }}>
          <Typography
            component="h1"
            variant="h4"
            className="header-h4 welcom-text"
          >
            You&#39;re almost there
          </Typography>
          <Typography
            component="h1"
            variant="h5"
            className="header-h5 second-header confirm-email-address"
            sx={{ fontWeight: "bold !important" }}
          >
            Please check your email to confirm your email address.
          </Typography>
          <Typography
            component="p"
            className="login-text"
            sx={{ fontWeight: "bold !important" }}
          >
            Once you click on the confirm link you will be taken to the new
            member login page to complete your set up
          </Typography>

          <Typography
            component="p"
            className="link-text"
            sx={{ fontWeight: "bold !important" }}
          >
            <u>Didn&#39;t receive your confirmation email?</u> <br />
            Please first check your spam/junk email folder. <br />
            If you still don&#39;t have it, please{" "}
            <span onClick={handleClickResenMail}>
              <u>click here</u>
            </span>{" "}
            to resend it <br />
            {/* Didn&#39;t receive your confirmation email, <br /> please <span onClick={handleClickResenMail}><u>click here</u></span> to resend it */}
          </Typography>
        </Container>
      </Grid>
    );
  };
  return (
    <ThemeProvider theme={mdTheme}>
      <SignUpLayout>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <ResendEmailSidebar />
          {/* <Grid
            item
            xs={12}
            sm={12}
            md={6}
            component={Paper}
            className="login-form-container"
            elevation={6}
            square
          >
            <Box
              className="quotation-text-container"
              sx={{ my: { xs: 6, sm: 8, md: 10 }, p: { xs: 2, sm: 4, md: 4 } }}
            >
              <Typography
                component="h1"
                variant="h6"
                className="quotation-text"
              >
                Education is the passport to the future... for tomorrow belongs
                to those who prepare for it today
              </Typography>
              {/* <Box sx={{width: "70%", textAlign:"end"}}>
                            <Typography component="h1" variant="subtitle2" className="author-text" sx={{ mr: { xs: 4, sm: 4, md: 8 } }}>
                                Malcolm X
                            </Typography>
                        </Box> */}
          {/*</Box>
          </Grid> */}
        </Grid>
      </SignUpLayout>
    </ThemeProvider>
  );
}

export default ResendEmailLayout;
