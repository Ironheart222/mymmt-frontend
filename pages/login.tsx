import * as React from "react";
import {
  OutlinedInput,
  IconButton,
  Container,
  InputAdornment,
  Button,
  TextField,
  CssBaseline,
  Link,
  Paper,
  Box,
  Grid,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import {
  Lock,
  Email,
  VisibilityOff,
  Visibility,
  QuestionMark,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../config/theme_config";
import { InputLabel } from "@mui/material";
import { Backdrop } from "@mui/material";
import { useRouter } from "next/router";
import { createLogin, emailVerification } from "../store/thunk/userThunk";
import { useAppDispatch, useAppSelector } from "../store/store";
import Validations from "../helpers/validations";
import { ApolloClientType } from "../store/Interface";
import VerifiedEmailSidebar from "../components/verified-email-sidebar";
import LoginSideBar from "../components/login-sidebar";
import { updateParentEmail } from "../store/thunk/parentThunk";
import { styled } from "@mui/material/styles";
import SignUpLayout from "../components/signup/signup-layout";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

interface State {
  password: string;
  email: string;
  showPassword: boolean;
}

interface FormValidation {
  password?: string;
  email?: string;
}

const passwordTooltip =
  "You can use either the Student or Parent Portal password";
const parentRoutes = [
  "/parentportal",
  "/parentportal/subscription-plan",
  "/parentportal/affiliate",
  "/parentportal/payment-method",
  "/parentportal/resources",
  "/parentportal/resource-detail",
  "/parentportal/reset-password",
  "/#!/parentportal",
  "/#!/parentportal/subscription-plan",
  "/#!/parentportal/affiliate",
  "/#!/parentportal/payment-method",
  "/#!/parentportal/resources",
  "/#!/parentportal/resource-detail",
  "/#!/parentportal/reset-password",
];

const signUpRoutes = [
  "/signup1",
  "/signup2",
  "/#!/signup1",
  "/#!/signup2",
  "/cancel-membership",
  "/#!/cancel-membership",
];

function SignInSide() {
  console.log("line no-45");

  const dispatch = useAppDispatch();
  const Router = useRouter();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);
  const { weeklyLessonData } = useAppSelector(
    (state) => state.childLessonReducer
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [verificationPage, setVerificationPage] =
    React.useState<boolean>(false);
  const [sidebarDetails, setSidebarDetails] = React.useState<any>({});
  const [headerDetails, setHeaderDetails] = React.useState<any>({
    title: "Login",
    subtitle: "Welcome back.",
  });
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => setMounted(true), 500);
  }, []);

  const { token, updateEmail }: any = Router.query;
  console.log("line no-62", token, updateEmail);

  React.useEffect(() => {
    if (token && updateEmail && updateEmail == "false") {
      setVerificationPage(true);
      let _request = {
        token: token,
        is_verify: true,
      };
      setSidebarDetails({
        title: "Verification Successful",
        subtitle: "Thank you for verifying your email address.",
        paragraph: "Please sign in to finish setting up your account.",
      });
      setHeaderDetails({
        title: "New Member Login & Setup",
        subtitle: "Welcome back. Please log in using your details below",
      });

      dispatch(
        emailVerification({
          _request,
          userClient,
          result: (res: any) => {
            console.log("res");
          },
        })
      );
    } else if (token && updateEmail && updateEmail == "true") {
      setVerificationPage(true);
      let _request = {
        token: token,
        is_verify: true,
      };
      setSidebarDetails({
        title: "Verification of your NEW Email Address Successful",
        subtitle: "Thank you for verifying your new email address",
        paragraph:
          "Please use this email address from now on to login to the Lesson Portal or the Parent Portal. Your Password remains the same unless you changed it.",
      });
      setHeaderDetails({
        title: "Login",
        subtitle: "Please login using your New Email and Password",
      });
      dispatch(updateParentEmail({ _request, userClient }));
    }
  }, [token, updateEmail]);

  console.log("line no-104");

  React.useEffect(() => {
    const pathName = Router.asPath;
    const isChild = localStorage.getItem("is_child");
    const childId = localStorage.getItem("child_id");
    const slicedString = pathName.substring(
      0,
      pathName.lastIndexOf("/") ? pathName.lastIndexOf("/") : pathName.length
    );

    console.log("pathName", pathName);
    console.log("slicedString Status", slicedString);

    console.log(
      "ResultLoginCheck",
      localStorage.getItem("user_token") &&
        isChild === "true" &&
        !childId &&
        pathName !== "/select-profile" &&
        !parentRoutes.includes(slicedString) &&
        !signUpRoutes.includes(slicedString) &&
        pathName !== "/termsandconditions" &&
        pathName !== "/privacypolicy" &&
        pathName !== "/#!/termsandconditions" &&
        pathName !== "/#!/privacypolicy"
    );

    if (
      localStorage.getItem("user_token") &&
      isChild === "true" &&
      !childId &&
      pathName !== "/select-profile" &&
      !parentRoutes.includes(slicedString) &&
      !signUpRoutes.includes(slicedString) &&
      pathName !== "/termsandconditions" &&
      pathName !== "/privacypolicy" &&
      pathName !== "/#!/termsandconditions" &&
      pathName !== "/#!/privacypolicy"
    ) {
      console.log("Redirect select profile login page");

      Router.replace("/select-profile");
    }
  }, []);

  console.log("line no-110");

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
  });
  console.log("line no-125");
  const [formError, setFormError] = React.useState<FormValidation>();

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };
  console.log("line no-131");
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  console.log("line no-142");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // // eslint-disable-next-line no-console
    // console.log({
    //     email: data.get('email'),
    //     password: data.get('password'),
    // });
    let reqParams: any = {
      email: values.email,
      password: values.password,
    };
    let allError = Validations.validateLoginForm(reqParams);
    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(createLogin({ _request: reqParams, userClient }));
    }
    setFormError(allError);
  };

  console.log("line no-166");
  const handleRedirection = () => {
    console.log("redirect to signup");
    window.location.href =
      "https://www.my5mt.com/my-5-minute-maths-tutor-membership-plans";
    // Router.push("/signup");
  };

  const containerLoginVerifyCss = {
    height: "100vh",
  };

  const containerLoginCss = {
    display: "flex",
    justifyContent: "center",
    backgroundImage: `url(${"../images/sign-up-pricing-background.jpg"})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    pt: "15px",
    // minHeight: "100vh",
  };

  if (!mounted) {
    return (
      <div className="loader">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <div className="balls">
            <div className="ball one"></div>
            <div className="ball two"></div>
            <div className="ball three"></div>
          </div>
        </Backdrop>
      </div>
    );
  }

  return (
    <ThemeProvider theme={mdTheme}>
      {verificationPage ? (
        <SignUpLayout>
          <Grid
            container
            component="main"
            sx={containerLoginCss}
            className="login-page-container"
          >
            <CssBaseline />
            {/* <VerifiedEmailSidebar sidebarDetails={sidebarDetails} /> */}
            {/* <VerifiedEmailSidebar /> */}
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
                Verification Successful
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
                variant="h4"
                className="header-title-login-verification-header1"
              >
                Thank you for verifying your email address
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
                variant="h6"
                className="header-title-login-verification-header2"
              >
                Please sign in to finish setting up your account
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              xl={5}
              lg={5}
              component={Paper}
              className="login-form-container"
              elevation={6}
              square
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                maxHeight: "650px",
                mt: 0,
                mb: 0,
              }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  className="header-title"
                >
                  {headerDetails.title}
                </Typography>
                <Typography component="p" className="header-subtitle">
                  {headerDetails.subtitle}
                </Typography>
                <Box
                  component="form"
                  className="form-element"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  <InputLabel className="textfield-label">
                    Email Address
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="user-email"
                    value={values.email}
                    onChange={handleChange("email")}
                    // autoComplete="user-email"
                    placeholder="Email address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                    error={formError && formError.email ? true : false}
                    helperText={formError && formError.email}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InputLabel className="textfield-label" required>
                      Password
                    </InputLabel>
                    <BootstrapTooltip title={passwordTooltip} arrow>
                      <QuestionMark className="helper-icon" />
                    </BootstrapTooltip>
                  </Box>
                  {/* <InputLabel className="textfield-label">Password</InputLabel> */}
                  <OutlinedInput
                    required
                    fullWidth
                    type={values.showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange("password")}
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
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formError && formError.password && (
                    <FormHelperText error id="password-error">
                      {formError.password}
                    </FormHelperText>
                  )}

                  <div className="forgot-link">
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2, pt: 1, pb: 1 }}
                    disabled={loading ? true : false}
                  >
                    Login
                    {loading && (
                      <CircularProgress color={"primary"} size={20} />
                    )}
                  </Button>
                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid
                      item
                      onClick={handleRedirection}
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography component="span" variant="caption">
                        Not a member?{" "}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        className="register-link"
                      >
                        {"Create New Account"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
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
      ) : (
        <SignUpLayout>
          <Grid
            container
            component="main"
            sx={containerLoginCss}
            className="login-page-container"
          >
            <CssBaseline />
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
                Welcome back!
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              xl={5}
              lg={6}
              component={Paper}
              className="login-form-container"
              elevation={6}
              square
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                maxHeight: "650px",
                mt: 0,
                mb: 0,
              }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  width: "70%",
                }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  className="header-title"
                >
                  {headerDetails.title}
                </Typography>
                <Typography component="p" className="header-subtitle">
                  {headerDetails.subtitle}
                </Typography>
                <Box
                  component="form"
                  className="form-element"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  <InputLabel className="textfield-label">
                    Email Address
                  </InputLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    name="user-email"
                    value={values.email}
                    onChange={handleChange("email")}
                    // autoComplete="user-email"
                    placeholder="Email address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                    error={formError && formError.email ? true : false}
                    helperText={formError && formError.email}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InputLabel className="textfield-label" required>
                      Password
                    </InputLabel>
                    <BootstrapTooltip title={passwordTooltip} arrow>
                      <QuestionMark className="helper-icon" />
                    </BootstrapTooltip>
                  </Box>
                  {/* <InputLabel className="textfield-label">Password</InputLabel> */}
                  <OutlinedInput
                    required
                    fullWidth
                    type={values.showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange("password")}
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
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formError && formError.password && (
                    <FormHelperText error id="password-error">
                      {formError.password}
                    </FormHelperText>
                  )}

                  <div className="forgot-link">
                    <Link href="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2, pt: 1, pb: 1 }}
                    disabled={loading ? true : false}
                  >
                    Login
                    {loading && (
                      <CircularProgress color={"primary"} size={20} />
                    )}
                  </Button>
                  <Grid container>
                    <Grid item xs></Grid>
                    <Grid
                      item
                      onClick={handleRedirection}
                      sx={{ cursor: "pointer" }}
                    >
                      <Typography component="span" variant="caption">
                        Not a member?{" "}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        className="register-link"
                      >
                        {"Create New Account"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
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
              <Typography component="p" className="login-text-bottom">
                {/* The more you learn, the more things you&#39;ll know.
                <br />
                The more that you learn, the more places you&#39;ll go.
                <br />
                Dr Seuss */}
              </Typography>
            </Grid>
          </Grid>
        </SignUpLayout>
      )}
    </ThemeProvider>
  );
}

export default SignInSide;
