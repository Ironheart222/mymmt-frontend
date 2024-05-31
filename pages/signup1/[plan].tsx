import * as React from "react";
import {
  Button,
  TextField,
  CssBaseline,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Link,
} from "@mui/material";
import HttpsIcon from "@mui/icons-material/Https";

import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../store/store";
import Validations from "../../helpers/validations";
import { ApolloClientType } from "../../store/Interface";
import { getSubscriptionPlanList } from "../../store/thunk/admin/subscription";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import SignUpLayout from "../../components/signup/signup-layout";

interface State {
  first_name: string;
  last_name: string;
  login_password?: string;
  setting_password?: string;
  email: string;
  confirm_email?: string;
}

interface FormValidation {
  first_name?: string;
  last_name?: string;
  email?: string;
  confirm_email?: string;
  login_password?: string;
  setting_password?: string;
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#99FD31" : "#308fe8",
  },
}));

function SignUpPricing() {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const { plan }: any = Router.query;

  const [loading, setLoading] = React.useState<boolean>(false);

  const [values, setValues] = React.useState({
    email: "",
    confirm_email: "",
    first_name: "",
    last_name: "",
    login_password: "",
    setting_password: "",
    showPassword: false,
    showParentPassword: false,
  });

  const [formError, setFormError] = React.useState<FormValidation>();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { adminClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  React.useEffect(() => {
    dispatch(getSubscriptionPlanList(adminClient));
  }, []);

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let reqParams: any = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email,
      confirm_email: values.confirm_email,
    };
    let allError = Validations.validateSignup1PricingForm(reqParams);
    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);

      Router.push(
        {
          pathname: `/signup2/${plan}`,
          query: {
            plan: plan,
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim(),
          },
        },
        `/signup2/${plan}`
      );
    }
    setFormError(allError);
  };

  return (
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
          // height: "100vh",
          pt: 3,
        }}
        className="signup-first-page-container"
      >
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={10}
          md={4}
          component={Paper}
          square
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            maxHeight: "650px",
            mt: 0,
          }}
          className="signup-first-page"
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
              Start Your FREE 14-Day Trial Now!
            </Typography>
            <BorderLinearProgress variant="determinate" value={50} />
            <Typography
              component="p"
              className=""
              sx={{ textAlign: "center", mt: 1 }}
            >
              Create Your Account: Step 1 of 2
            </Typography>
            <Box
              component="form"
              className="form-element"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={1}>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    name="first_name"
                    sx={{ pt: 0 }}
                    onChange={handleChange("first_name")}
                    error={formError && formError.first_name ? true : false}
                    helperText={formError && formError.first_name}
                    InputLabelProps={{
                      style: { color: "#b2b2b2", marginTop: "-3.5px" },
                    }}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    sx={{ pt: 0 }}
                    onChange={handleChange("last_name")}
                    error={formError && formError.last_name ? true : false}
                    helperText={formError && formError.last_name}
                    InputLabelProps={{
                      style: { color: "#b2b2b2", marginTop: "-3.5px" },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="email"
                    id="email"
                    label="Email Address"
                    name="email"
                    sx={{ pt: 0 }}
                    onChange={handleChange("email")}
                    error={formError && formError.email ? true : false}
                    helperText={formError && formError.email}
                    InputLabelProps={{
                      style: { color: "#b2b2b2", marginTop: "-3.5px" },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="email"
                    id="confirm_email"
                    label="Confirm email"
                    name="confirm_email"
                    sx={{ pt: 0 }}
                    onChange={handleChange("confirm_email")}
                    error={formError && formError.confirm_email ? true : false}
                    helperText={formError && formError.confirm_email}
                    InputLabelProps={{
                      style: { color: "#b2b2b2", marginTop: "-3.5px" },
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mb: 2,
                  mt: 2,
                  backgroundColor: "#99FD31",
                  color: "rgb(0, 0, 0)",
                }}
                disabled={loading ? true : false}
              >
                CONTINUE <ArrowRightAltIcon />
                {loading && <CircularProgress color={"primary"} size={20} />}
              </Button>
              <Grid container>
                <Grid item sx={{ cursor: "pointer" }}>
                  <Typography component="span" variant="caption">
                    <HttpsIcon sx={{ fontSize: "12px" }} /> By providing your
                    information you are consenting to the collection and use of
                    your information in accordance with our{" "}
                    <Link
                      href="/termsandconditions"
                      target="blank"
                      sx={{ color: "#1976d2" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacypolicy"
                      target="blank"
                      sx={{ color: "#1976d2" }}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SignUpLayout>
  );
}

export default SignUpPricing;
