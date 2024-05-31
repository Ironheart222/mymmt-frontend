import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import * as React from "react";
import AddCardDetailModal from "../model/add-card-details-model";
import CardLayout from "./card-layout";
import { ApolloClientType } from "../../store/Interface";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { gettingCustomerStripeDetail } from "../../store/thunk/subscription";

function PaymentMethod() {
  const dispatch = useAppDispatch();
  const { stripeCustomerDetail, componentLoading } = useAppSelector(
    (state) => state.subscriptionSlice
  );
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const [loading, setLoading] = React.useState<boolean>(true);
  const [openCardDetail, setOpenCardDetail] = React.useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = React.useState<any>("");
  const [defaultMethod, setDefaultMethod] = React.useState("");

  React.useEffect(() => {
    // setLoading(true);
    dispatch(gettingCustomerStripeDetail(userClient));
  }, []);

  React.useEffect(() => {
    if (stripeCustomerDetail && Object.keys(stripeCustomerDetail).length > 0) {
      setCustomerDetails(stripeCustomerDetail);
    } else {
      setCustomerDetails("");
    }
  }, [stripeCustomerDetail]);

  React.useEffect(() => {
    setLoading(componentLoading);
  }, [componentLoading]);

  React.useEffect(() => {
    if (
      customerDetails &&
      customerDetails?.stripeCustomerDetail?.invoice_settings
    ) {
      let method =
        customerDetails?.stripeCustomerDetail?.invoice_settings
          ?.default_payment_method;
      setDefaultMethod(method);
    }
  }, [customerDetails]);

  const toggleCardDetail = () => {
    setOpenCardDetail(!openCardDetail);
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1" className="header-h6 border-green">
          Payment Method
        </Typography>
      </Box>
      <Box>
        {openCardDetail && (
          <AddCardDetailModal
            onClose={toggleCardDetail}
            open={openCardDetail}
            paymentMethods={null}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            // pl: 1
          }}
        >
          <Typography variant="subtitle2" className="header-subtext">
            Saved cards
          </Typography>
          <Button variant="contained" onClick={toggleCardDetail}>
            Add New
          </Button>
        </Box>
      </Box>
      {loading && (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress size={20} />
        </Box>
      )}
      <Grid container>
        {!loading &&
          (customerDetails &&
          customerDetails.paymentMethods &&
          customerDetails.paymentMethods.length > 0 ? (
            customerDetails.paymentMethods.map((value: any, index: number) => {
              return (
                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  sx={{ my: 1, mr: 1 }}
                  key={index}
                >
                  <CardLayout
                    paymentMethod={value}
                    defaultMethod={
                      defaultMethod && defaultMethod == value.id ? true : false
                    }
                  />
                </Grid>
              );
            })
          ) : (
            <span className="Empty-card-text">No cards are available</span>
          ))}
      </Grid>
    </Box>
  );
}

export default PaymentMethod;
