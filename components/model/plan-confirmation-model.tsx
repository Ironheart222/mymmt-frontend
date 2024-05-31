import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ApolloClientType } from "../../store/Interface";
import {
  upgradeSubscriptionPlan,
  verifyDiscountCode,
} from "../../store/thunk/subscription";
import { AmountType } from "../admin/discount-code/add-discount-code";
import { DiscountDetail } from "../../store/slices/subscriptionSlice";
import CloseIcon from "@mui/icons-material/Close";
import { notificationFail } from "../../store/slices/notificationSlice";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedPlan: any;
  toggleSuccessModel: () => void;
  defaultPaymentMethod: string;
  toggleSelectPaymentMethod: () => void;
  setUpgradePlanDataFunc: (request: any) => void;
  stripePaymentMethod: () => void;
}

function PlanConfirmationModel(props: Props) {
  let {
    open,
    onClose,
    selectedPlan,
    toggleSuccessModel,
    defaultPaymentMethod,
    toggleSelectPaymentMethod,
    setUpgradePlanDataFunc,
    stripePaymentMethod,
  } = props;

  const dispatch = useAppDispatch();
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { discountDetail } = useAppSelector((state) => state.subscriptionSlice);

  const [openAddCodeText, setOpenAddCodeText] = React.useState<boolean>(true);
  const [openAddCodeInput, setOpenAddCodeInput] =
    React.useState<boolean>(false);
  const [openCodeLabel, setOpenCodeLabel] = React.useState<boolean>(false);
  const [codeApplyLoading, setCodeApplyLoading] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [promotionCode, setPromotionCode] = React.useState<string>("");
  const [totalAmount, setTotalAmount] = React.useState<string>("");
  const [couponData, setCouponData] = React.useState<any>(null);
  const [discountOff, setDiscountOff] = React.useState<string>("");

  const calculateDiscount = React.useMemo(() => {
    let discountPrice: number;

    if (couponData && Object.keys(couponData).length > 0) {
      if (couponData.amount_off) {
        discountPrice =
          Number(selectedPlan.product_price.unit_amount) / 100 -
          parseFloat(couponData.amount_off);
        setTotalAmount(discountPrice.toFixed(2));
        setDiscountOff(couponData.amount_off.toFixed(2) + "$");
        return couponData.amount_off;
      } else if (couponData.percent_off) {
        let amountOff =
          ((Number(selectedPlan.product_price.unit_amount) / 100) *
            couponData.percent_off.toFixed(2)) /
          100;

        discountPrice =
          Number(selectedPlan.product_price.unit_amount) / 100 - amountOff;
        setTotalAmount(discountPrice.toFixed(2));
        setDiscountOff(couponData.percent_off.toFixed(2) + "%");
        return amountOff;
      }
    } else {
      let totalAmount = Number(selectedPlan?.product_price?.unit_amount) / 100;
      setTotalAmount(totalAmount.toFixed(2));
    }
  }, [couponData]);

  React.useEffect(() => {
    let totalAmount = Number(selectedPlan.product_price.unit_amount) / 100;
    setTotalAmount(totalAmount.toFixed(2));
  }, []);

  React.useEffect(() => {
    if (Object.keys(discountDetail).length > 0) {
      setCouponData(discountDetail);
    } else {
      setCouponData(null);
    }
  }, [discountDetail]);

  const handleDelete = () => {
    dispatch(DiscountDetail({}));
    setOpenAddCodeText(true);
    setOpenAddCodeInput(false);
    setOpenCodeLabel(false);
  };

  const handleAddPromotionCode = () => {
    setOpenAddCodeText(false);
    setOpenAddCodeInput(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromotionCode(event.target.value);
  };

  const handleFocusout = () => {
    if (promotionCode == "" || promotionCode == null) {
      setOpenAddCodeText(true);
      setOpenAddCodeInput(false);
    }
  };

  const result = (response: any) => {
    setCodeApplyLoading(false);
    if (response.status === "true") {
      setOpenAddCodeText(false);
      setOpenAddCodeInput(false);
      setOpenCodeLabel(true);
    }
  };

  const handleApplyDiscountCode = () => {
    let _request = {
      discount_code: promotionCode.toUpperCase(),
      plan_id: selectedPlan?.trial_alias,
    };
    setCodeApplyLoading(true);
    dispatch(verifyDiscountCode({ _request, userClient, result }));
  };

  const handlePurchasePlan = () => {
    if (openAddCodeInput && promotionCode != "") {
      dispatch(
        notificationFail("Please click on apply for add promotion code")
      );
      return false;
    }

    toggleSelectPaymentMethod(); //Show Payment Methods
    stripePaymentMethod(); // Show Direct Stripe Payment as hide paypal payment

    let _request = {
      paymentData: {
        selectedProduct: selectedPlan,
        numberOfmember: 1,
        coupon: couponData,
        defaultPaymentMethod: defaultPaymentMethod,
      },
      totalAmount,
    };

    setUpgradePlanDataFunc(_request);
    /*setLoading(true);
    dispatch(
      upgradeSubscriptionPlan({
        _request,
        userClient,
        result: (res: any) => {
          if (res.status === "true") {
            toggleSuccessModel();
          }
          onClose();
          setLoading(false);
        },
      })
    ); */
  };

  return (
    <Dialog
      fullWidth={true}
      // onClose={onClose}
      maxWidth={"sm"}
      scroll="paper"
      open={open}
    >
      <Container sx={{ py: 2 }}>
        <IconButton
          color="default"
          sx={{ float: "right" }}
          onClick={onClose}
          className="ProdcutClose-icon"
          aria-label="close"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <div className="ProductSummary-info is-clickable">
          <span className="ProductSummary-name">Subscribe with Math Tutor</span>
          <Box className="ProductSummaryTotalAmount-flex-container">
            <span className="product-total-amount">${totalAmount}</span>
            <span className="ProductSummaryTotalAmount-billingInterval">
              <div>
                per <br className="BillingIntervalBreak" />
                month
              </div>
            </span>
          </Box>
        </div>

        <div className="product-list">
          <Box className="Product-flex-item">
            <span className="ProductSummery-List-Name">
              {selectedPlan.name} Membership
            </span>
            <span className="ProductSummery-List-Name">
              <span>
                $
                {(Number(selectedPlan.product_price.unit_amount) / 100).toFixed(
                  2
                )}
              </span>
            </span>
          </Box>
          <span className="ProductSummery-List-Subtext">
            Qty 1 Billed monthly
          </span>
        </div>

        <div className="product-details-subtotal-container Bottom-Border">
          <Box className="Product-flex-item">
            <span className="ProductSubtotal-text">Subtotal</span>
            <span className="ProductSummery-List-Name">
              <span>
                $
                {(Number(selectedPlan.product_price.unit_amount) / 100).toFixed(
                  2
                )}
              </span>
            </span>
          </Box>
        </div>

        <div className="ProductSummeryAddCoupon-container Bottom-Border">
          {openAddCodeText && (
            <span
              className="AddCoupon-code-text"
              onClick={handleAddPromotionCode}
            >
              Add promotion code
            </span>
          )}

          {openAddCodeInput && (
            <TextField
              fullWidth
              id="coupon-code"
              name="coupon_code"
              className="Add-coupon-textfield"
              placeholder="Add promotion code"
              value={promotionCode}
              onBlur={handleFocusout}
              onChange={handleChange}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {!codeApplyLoading ? (
                      promotionCode && (
                        <Button
                          variant="text"
                          onClick={handleApplyDiscountCode}
                        >
                          Apply
                        </Button>
                      )
                    ) : (
                      <CircularProgress color={"inherit"} size={20} />
                    )}
                  </InputAdornment>
                ),
              }}
              autoFocus
            />
          )}

          {openCodeLabel && (
            <div>
              <Box
                className="Product-flex-item"
                sx={{ alignItems: "center", mb: 1 }}
              >
                <Chip
                  icon={<LocalOfferRoundedIcon fontSize="small" />}
                  className="Product-promotion-chip"
                  label={promotionCode.toUpperCase()}
                  onDelete={handleDelete}
                  deleteIcon={<ClearRoundedIcon fontSize="small" />}
                />
                <span className="ProductSummery-Discount-Amount">
                  <span>-${Number(calculateDiscount).toFixed(2)}</span>
                </span>
              </Box>
              <span className="ProductSummery-off-amount">
                {discountOff} off
              </span>
            </div>
          )}
        </div>

        <div className="product-details-subtotal-container">
          <Box className="Product-flex-item">
            <span className="ProductSubtotal-text">Total Amount</span>
            <span className="ProductSummery-List-Name">
              <span>${totalAmount}</span>
            </span>
          </Box>
        </div>

        <div className="Product-purchase-container">
          <Button onClick={onClose} variant="text" sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handlePurchasePlan}>
            {loading ? (
              <CircularProgress color={"inherit"} size={20} />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </Container>
    </Dialog>
  );
}

export default PlanConfirmationModel;
