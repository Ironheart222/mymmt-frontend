import React, { useState } from "react";
import Head from "next/head";
import {
  OutlinedInput,
  IconButton,
  InputAdornment,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import {
  Lock,
  Email,
  VisibilityOff,
  Visibility,
  Height,
} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { InputLabel } from "@mui/material";
import Router, { useRouter } from "next/router";
import LoginSideBar from "../components/login-sidebar";
import { useAppDispatch, useAppSelector } from "../store/store";
import { ApolloClientType } from "../store/Interface";
import Validations from "../helpers/validations";
import { createAdminLogin } from "../store/thunk/admin/adminAuthThunk";
import AdminAuth from "../config/admin-auth";

interface State {
  password: string;
  email: string;
  showPassword: boolean;
}

interface FormValidation {
  password?: string;
  email?: string;
}

function Login() {
  const dispatch = useAppDispatch();
  const Router = useRouter();
  const { adminClient }: Partial<ApolloClientType> = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const notificationInfo = useAppSelector((state) => state.notificationReducer);

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
  });
  const [formError, setFormError] = React.useState<FormValidation>();
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (localStorage.getItem("admin_token")) {
      Router.replace("/admin/dashboard");
    }
  }, []);

  React.useEffect(() => {
    if (notificationInfo) {
      setLoading(false);
    }
  }, [notificationInfo]);

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let reqParams: any = {
      email: values.email.trim(),
      password: values.password.trim(),
    };

    let allError = Validations.validateLoginForm(reqParams);

    if (
      Object.entries(allError).length === 0 &&
      allError.constructor === Object
    ) {
      setLoading(true);
      dispatch(createAdminLogin({ _request: reqParams, adminClient }));
    }
    setFormError(allError);
  };

  const handleLogin = () => {
    Router.replace("/login");
  };

  const handleHomePageRedirect = () => {
    window.location.href = "https://www.my5mt.com/";
  };

  return (
    <>
      <Head>
        <title>Login | Admin</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#99FD31",
          height: "100vh",
        }}
      >
        <Box
          maxWidth={"sm"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/images/logo_trasparent_background.png"
            alt="logo"
            className={"logo"}
            style={{ minWidth: "210px" }}
          />
          <Typography component="h1" variant="h5" className="header-title">
            Admin Log in Page
          </Typography>
          <Box
            component="form"
            className="form-element"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
          >
            <InputLabel className="textfield-label">Email Id</InputLabel>
            <TextField
              required
              fullWidth
              className="admin_textfield"
              id="email"
              name="admin_email"
              placeholder="Email address"
              onChange={handleChange("email")}
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
            <InputLabel className="textfield-label">Password</InputLabel>
            <OutlinedInput
              required
              fullWidth
              className="admin_textfield"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              placeholder="Password"
              onChange={handleChange("password")}
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
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formError && formError.password && (
              <FormHelperText sx={{ mb: 2 }} error id="password-error">
                {formError.password}
              </FormHelperText>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2, pt: 1, pb: 1, mt: 4 }}
              disabled={loading ? true : false}
            >
              Login
              {loading && <CircularProgress color={"primary"} size={20} />}
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                type="button"
                onClick={handleHomePageRedirect}
                variant="contained"
                sx={{ width: "50%" }}
              >
                Home Page
              </Button>

              <Button
                type="button"
                variant="contained"
                onClick={handleLogin}
                sx={{ mt: 2, width: "50%" }}
              >
                Member Login
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Login;
