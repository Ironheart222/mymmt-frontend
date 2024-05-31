import {
  Button,
  Dialog,
  CircularProgress,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import PaymentCardLayout from "../payment-method/payment-card-layout";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import { gettingCustomerStripeDetail } from "../../store/thunk/subscription";

interface Props {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleCardModel: () => void;
  onProceed: (id: string, callBackFunc: (status: boolean) => void) => void;
}

export default function SelectPaymentModel(props: Props) {
  let { open, onClose, toggleCardModel, onProceed } = props;

  const dispatch = useAppDispatch();
  const { stripeCustomerDetail, componentLoading } = useAppSelector(
    (state) => state.subscriptionSlice
  );
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [customerDetails, setCustomerDetails] = React.useState<any>("");
  const [defaultMethod, setDefaultMethod] = React.useState("");
  const [loadingProceed, setLoadingProceed] = React.useState<boolean>(false);

  React.useEffect(() => {
    // setLoading(true);
    dispatch(gettingCustomerStripeDetail(userClient));
  }, []);

  React.useEffect(() => {
    if (stripeCustomerDetail && Object.keys(stripeCustomerDetail).length > 0) {
      setShowError(false);
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
      let methodId =
        customerDetails.stripeCustomerDetail.invoice_settings
          .default_payment_method;
      setDefaultMethod(methodId);
      setSelectedPaymentMethod(methodId);
    }
  }, [customerDetails]);

  const handleSelectedMethod = (id: number) => {
    setSelectedPaymentMethod(id);
  };

  const handleProceedMethod = () => {
    if (selectedPaymentMethod) {
      setShowError(false);
      setLoadingProceed(true);
      onProceed(selectedPaymentMethod, setLoadingProceed);
    } else {
      setShowError(true);
      setLoadingProceed(false);
    }
  };

  return (
    <Dialog open={open} scroll={"paper"} fullWidth maxWidth={"xs"}>
      <DialogTitle>
        <Typography variant="h6" sx={{ float: "left" }}>
          Payment Method
        </Typography>
        <IconButton
          color="default"
          sx={{ float: "right" }}
          onClick={onClose}
          className="ProdcutClose-icon"
          aria-label="close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Box sx={{ mx: 2, mb: 2, display: "flex", flexDirection: "column" }}>
        {loading && (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {showError && (
          <>
            <div className="error-text-message">
              <span>No method are available.</span>
            </div>
            {/* <Alert icon={false} severity='error' sx={{ mb: 2 }} onClose={() => { setShowError(false) }}>
                            No method are available.
                        </Alert> */}
          </>
        )}
        {!loading &&
          customerDetails &&
          customerDetails.paymentMethods &&
          customerDetails.paymentMethods.length > 0 &&
          customerDetails.paymentMethods.map((v: any, i: number) => {
            return (
              <PaymentCardLayout
                key={i}
                paymentMethod={v}
                selectedId={selectedPaymentMethod}
                onSelect={handleSelectedMethod}
              />
            );
          })}
        <Button
          variant="text"
          size="small"
          startIcon={<AddRoundedIcon />}
          onClick={toggleCardModel}
          sx={{
            width: "140px",
            mt: 2,
            mx: 1,
            color: "#5275DA",
            background: "#f1f5fd",
          }}
        >
          Add New
        </Button>
      </Box>

      <Button
        onClick={handleProceedMethod}
        variant="contained"
        sx={{ m: 2 }}
        disabled={loadingProceed ? true : false}
      >
        {loadingProceed ? (
          <CircularProgress color={"inherit"} size={20} />
        ) : (
          "Proceed"
        )}
      </Button>
    </Dialog>
  );
}
