import * as React from "react";
import {
  Button,
  CssBaseline,
  Paper,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";

import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import SignUpLayout from "../../components/signup/signup-layout";
import { cancelMembership } from "../../store/thunk/userThunk";
import { cancelMembershipPlan } from "../../store/thunk/subscription";
import { setLoading } from "../../store/slices/loadingSlice";

function CancelMemberShip() {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const { cancelid, subscription_id, subscription_type }: any = Router.query;

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const { isLoading } = useAppSelector((state) => state.loadingReducer);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cancelid) {
      dispatch(setLoading(true));
      if (subscription_id) {
        const requestCancelPlan = {
          subscription_id,
          subscription_type,
        };

        dispatch(
          cancelMembershipPlan({
            _request: requestCancelPlan,
            userClient,
            result: (res: any) => {},
          })
        );
      } else {
        let _request = {
          parent_id: +cancelid,
        };

        dispatch(cancelMembership({ _request, userClient }));
      }
    }
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
        className="signup-first-page-container cancel-membership-container"
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
            maxHeight: "250px",
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
              Cancel Membership
            </Typography>

            <Box
              component="form"
              className="form-element"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={1} sx={{ justifyContent: "center" }}>
                To cancel your membership, please select the button below.
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
                disabled={isLoading ? true : false}
              >
                Cancel Mebership
                {isLoading && <CircularProgress color={"primary"} size={20} />}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SignUpLayout>
  );
}

export default CancelMemberShip;
