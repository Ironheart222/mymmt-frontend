import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { term_condition_arr } from "../helpers/term_policy";

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
                    TERMS AND CONDITIONS OF EDUCATION PLAN
                </Typography>
                <Typography
                    component="h1"
                    variant="h6"
                    className="header-h5 privacy_policy_second-header"
                >
                    The company agrees to act in an ethical, diligent, prompt and
                    professional manner with regard to the Education Services provided.
                </Typography>
                {term_condition_arr.map((val, index) => {
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
