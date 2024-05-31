import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { policy_arr } from "../helpers/term_policy";

function PrivacyPolicy() {
    return (
        <Box className="privacy_policy_main">
            <Container>
                <Box sx={{ py: 6 }}>
                    <img src="/images/logo.png" alt="logo" className={"logo"} />
                </Box>
                <Typography
                    component="h1"
                    variant="h4"
                    className="header-h4 welcom-text"
                >
                    Privacy Policy
                </Typography>
                {policy_arr.map((val, index) => {
                    return (
                        <div key={index}>
                            <Typography
                                component="h5"
                                variant="h6"
                                className="header-h5 green-header"
                            >
                                {val.title}
                            </Typography>
                            <Typography component="p" className="privacy_policy_subtext pb-30">
                                <div dangerouslySetInnerHTML={{ __html: val.content }}></div>
                            </Typography>
                        </div>
                    );
                })}
            </Container>
        </Box>
    );
}
export default PrivacyPolicy;
