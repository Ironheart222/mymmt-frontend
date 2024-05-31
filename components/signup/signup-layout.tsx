import * as React from "react";

import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { mdTheme } from "../../config/theme_config";

function SignUpLayout(props: any) {
  const { children } = props;
  return (
    <ThemeProvider theme={mdTheme}>
      <div className="" style={{ backgroundColor: "#000000" }}>
        <img src="/images/logo.png" alt="logo" className="sign-up-logo" />
      </div>
      <Typography
        variant="h6"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#99FD31",
        }}
        className="signup-page-header"
      >
        My 5 Minute Maths Tutor: Making Maths A Superpower For Your Child
      </Typography>
      {children}
    </ThemeProvider>
  );
}

export default SignUpLayout;
