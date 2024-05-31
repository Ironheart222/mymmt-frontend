import Head from "next/head";
import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  InputAdornment,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../config/theme_config";
import LoginSideBar from "../components/login-sidebar";
import { Email } from "@mui/icons-material";
import Validations from "../helpers/validations";
import { forgotPassword } from "../store/thunk/parentThunk";
import { ApolloClientType, PasswordType } from "../store/Interface";
import { useAppDispatch, useAppSelector } from "../store/store";
import Router from "next/router";
import SignUpLayout from "../components/signup/signup-layout";

interface FormValidation {
  email?: string;
}

interface RequestType {
  email: string;
  password_type: PasswordType;
}

const forgotContainer = {
  backgroundColor: "#000",
  backgroundSize: "cover",
  backgroundPosition: "center",
  alignItems: "center",
  p: 2,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  width: "100%",
};

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  React.useEffect(() => {
    if (localStorage.getItem("user_token")) {
      // dispatch(setLoading(true));
      Router.replace("/lesson-library");
    }
  }, []);

  const [email, setEmail] = React.useState("");
  const [formError, setFormError] = React.useState<FormValidation>({});
  const notificationInfo = useAppSelector((state) => state.notificationReducer);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  const goToLogin = () => {
    Router.replace("/login");
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    let _request: RequestType = {
      email: email,
      password_type: PasswordType.LOGIN_PASSWORD,
    };
    let allError = Validations.validateForgotPasswordForm(_request);
    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(forgotPassword({ _request, userClient }));
    }
    setFormError(allError);
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <ThemeProvider theme={mdTheme}>
        <SignUpLayout>
          <Grid
            container
            component="main"
            sx={{
              display: "flex",
              justifyContent: "center",
              backgroundImage: `url(${"../images/sign-up-pricing-background.jpg"})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              pt: 3,
            }}
          >
            <CssBaseline />
            {/* <LoginSideBar /> */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                className="header-title-login"
              >
                Reset Your Password
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                className="header-h5 second-header confirm-email-address"
              >
                Forgotten your password, no problem.
                <br />
                Please enter your email below and we will send you a link to
                reset it.
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              component={Paper}
              className="login-form-container"
              elevation={6}
              square
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                mt: 0,
              }}
            >
              <Box sx={forgotContainer}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  type="email"
                  className="forgot-password-textfield"
                  placeholder="Enter email address"
                  onChange={(event) => setEmail(event.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  error={formError && formError.email ? true : false}
                  helperText={formError && formError.email}
                />
                <br />
                <div>
                  <Stack direction={"row"} justifyContent="center" spacing={2}>
                    <Button
                      variant="contained"
                      className="dialog-ok-button"
                      onClick={goToLogin}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      className="dialog-ok-button"
                      onClick={handleSubmit}
                      disabled={loading ? true : false}
                    >
                      {loading ? (
                        <CircularProgress color={"inherit"} size={20} />
                      ) : (
                        "Reset my password"
                      )}
                    </Button>
                  </Stack>
                </div>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                component="p"
                className="login-text-bottom"
              ></Typography>
            </Grid>
          </Grid>
        </SignUpLayout>
      </ThemeProvider>
    </>
  );
}

export default ForgotPassword;
