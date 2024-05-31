import {
  Button,
  Dialog,
  CircularProgress,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import { getPaypalPaymentDetails } from "../../store/thunk/admin/subscription";

interface Props {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  toggleCardModel: () => void;
  onProceed: (id: string) => void;
  stripePaymentMethod: () => void;
  selectedPlan: any;
  totalAmount: string;
}

export default function SelectPaymentMethodModel(props: Props) {
  let { open, onClose, stripePaymentMethod, selectedPlan, totalAmount } = props;
  const { discountDetail } = useAppSelector(
    (state: any) => state.subscriptionSlice
  );

  const dispatch = useAppDispatch();

  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const handlePaypalProceedMethod = () => {
    const requestData = {
      plan_id: selectedPlan?.paypal_plan_id,
      price: totalAmount,
      coupon: discountDetail ? discountDetail?.id : "",
    };

    dispatch(
      getPaypalPaymentDetails({
        _request: requestData,
        userClient,
        result: (response: any) => {
          setLoading(false);
        },
      })
    );

    setLoading(true);
  };

  return (
    <Dialog open={open} scroll={"paper"} fullWidth maxWidth={"xs"}>
      <DialogTitle>
        <Typography variant="h6" sx={{ float: "left" }}>
          Select Payment Method
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
        <Button onClick={stripePaymentMethod} variant="contained">
          Stripe Payment
        </Button>
        <Button
          onClick={handlePaypalProceedMethod}
          variant="contained"
          sx={{ mt: 1 }}
          disabled={loading ? true : false}
        >
          Paypal Payment{" "}
          {loading && <CircularProgress color={"primary"} size={20} />}
        </Button>
      </Box>
    </Dialog>
  );
}
