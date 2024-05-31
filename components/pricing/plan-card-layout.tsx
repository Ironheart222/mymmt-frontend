import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import { useEffect, useState } from "react";

export default function PlanCardLayout(props: any) {
  let {
    tier,
    currentPlan,
    invoiceDetails,
    customerData,
    toggleSelectMethod,
    toggleSelectePlan,
    toggleSelectPaymentMethod,
    currentPlanType,
    setCurrentPlanIndexFunc,
    currentPlanIndexValue,
    planIndex,
    handleDefaultPaymentFunc,
    cancelMemberShipFunc,
  } = props;

  const [descriptionArr, setDescriptionArr] = useState<string[]>([]);
  const [maxChildAllowed, setMaxChildAllowed] = useState<string>();
  const [amount, setAmount] = useState<string>();

  useEffect(() => {
    if (tier) {
      let arr = [];
      if (tier.description) {
        arr = tier.description.split("|");
      }
      setDescriptionArr(arr);

      if (tier.metadata?.max_child_allowed) {
        setMaxChildAllowed(tier.metadata?.max_child_allowed);
      }

      let amt = Number(tier.product_price?.unit_amount);
      // let amount_2 = 0;
      // if (currentPlan && invoiceDetails?.total && tier.id == currentPlan?.id) {
      //   amt = invoiceDetails?.total || 0;
      //   //     amount_2 = Number(subscriptionDetails.discount.coupon.amount_off);
      // }
      // let tempAmount = ((amount_1 - amount_2)/100).toFixed(2);
      amt = Number(amt) / 100;
      setAmount(amt.toFixed(2));
    }
  }, [tier, currentPlan]);

  const handleChoosePlan = (tier: any) => {
    toggleSelectePlan(tier);
    // toggleSelectPaymentMethod();
    handleDefaultPaymentFunc();
  };

  const getButtonFlag = (tier: any, currPlan: any) => {
    let disable = false;

    if (currentPlanType == "paypal") {
      if (
        (currPlan && tier.paypal_plan_id == currPlan.plan_id) ||
        (customerData &&
          tier.paypal_plan_id ==
            customerData?.subscription_detail[0]?.product_id)
      ) {
        disable = true;
      }

      //OLD LOGIC FOR DISABLE BUTTON PRICE
      // if (
      //   currPlan &&
      //   Number(tier.product_price?.unit_amount) / 100 <=
      //     Number(currPlan?.shipping_amount?.value)
      // ) {
      //   disable = true;
      // }

      if (planIndex < currentPlanIndexValue) {
        disable = true;
      }
    } else {
      if (
        (currPlan && tier.id == currPlan.id) ||
        (customerData &&
          tier.id == customerData?.subscription_detail[0]?.product_id)
      ) {
        disable = true;
      }

      //OLD LOGIC FOR DISABLE BUTTON BASED ON PRICE
      // if (
      //   currPlan &&
      //   Number(tier.product_price?.unit_amount) <=
      //     Number(invoiceDetails?.subtotal)
      // ) {
      //   disable = true;
      // }
      if (planIndex < currentPlanIndexValue) {
        disable = true;
      }
    }

    return disable;
  };

  const getButtonLabel = (tier: any, currPlan: any) => {
    let label = "Choose Plan";

    if (currentPlanType == "paypal") {
      // Old Logic condition on price
      // if (
      //   currPlan?.shipping_amount &&
      //   Number(tier.product_price?.unit_amount) / 100 >=
      //     Number(currPlan?.shipping_amount?.value)
      // ) {
      //   label = "Upgrade Plan";
      // }

      if (planIndex > currentPlanIndexValue) {
        label = "Upgrade Plan";
      }

      if (
        (currPlan && tier.paypal_plan_id == currPlan.plan_id) ||
        (customerData &&
          tier.paypal_plan_id ==
            customerData?.subscription_detail[0]?.product_id)
      ) {
        label = "Current Plan";
        setCurrentPlanIndexFunc(planIndex); //For track and set other plan for Upgrade/Choose based on this if higher plan then current then show upgrade if lower then show choose plan
      }

      if (
        !currPlan &&
        tier.paypal_plan_id !== customerData?.subscription_detail[0]?.product_id
      ) {
        label = "Choose Plan";
      }
    } else {
      // Old Logic condition on price
      // if (
      //   invoiceDetails &&
      //   Number(tier.product_price?.unit_amount) >=
      //     Number(invoiceDetails?.subtotal)
      // ) {
      //   label = "Upgrade Plan";
      // }

      if (planIndex > currentPlanIndexValue) {
        label = "Upgrade Plan";
      }

      if (
        (currPlan && tier.id == currPlan.id) ||
        (customerData &&
          tier.id == customerData?.subscription_detail[0]?.product_id)
      ) {
        label = "Current Plan";
        setCurrentPlanIndexFunc(planIndex); //For track and set other plan for Upgrade/Choose based on this if higher plan then current then show upgrade if lower then show choose plan
      }

      if (
        !currPlan &&
        tier.id !== customerData?.subscription_detail[0]?.product_id
      ) {
        label = "Choose Plan";
      }
    }

    return label;
  };

  const getCancelationButton = (tier: any, currPlan: any) => {
    if (
      (currPlan &&
        currentPlanType == "paypal" &&
        tier.paypal_plan_id == currPlan.plan_id &&
        !currPlan.is_cancel) ||
      (currentPlanType == "stripe" &&
        currPlan &&
        tier.id == currPlan.id &&
        !currPlan.is_cancel)
    ) {
      return (
        <Typography
          variant="body2"
          noWrap
          component="p"
          sx={{ textAlign: "center", cursor: "pointer" }}
          className="cancel-membership-text"
          onClick={cancelMemberShipFunc}
        >
          Cancel Membership
        </Typography>
      );
    } else {
      return null;
    }
  };

  return (
    <Box className="Pricing-card">
      <Box>
        <Typography
          variant="h6"
          noWrap
          component="div"
          className="Pricing-title Pricing-main"
        >
          {tier.name}
        </Typography>
      </Box>
      <Box sx={{ my: 0.3 }}>
        <div className="Pricing-second-block">
          <Typography
            variant="body2"
            noWrap
            component="div"
            className="Pricing-subtitle"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Number(maxChildAllowed) < 2 && (
                <PersonIcon className="Pricing-icon" />
              )}
              {Number(maxChildAllowed) == 2 && (
                <PeopleIcon className="Pricing-icon" />
              )}
              {Number(maxChildAllowed) > 2 && (
                <img
                  src="/images/person_group.png"
                  width="36px"
                  height="18px"
                  style={{ marginRight: "12px" }}
                />
              )}
              {tier.metadata?.subtitle || ""}

              {/* {tier.title === "Single membership" ?
                                <PersonIcon className="Pricing-icon" />
                                : <img src="/images/person_group.png" width="36px" height="18px" style={{ marginRight: "12px" }} />}
                            {tier.subtext} */}
            </Box>
          </Typography>
        </div>
      </Box>
      <Box className="Pricing-body">
        <ul>
          {descriptionArr.map((line: any, index: any) => (
            <Box
              key={index}
              sx={{ display: "flex", flexDirection: "row", mt: 1 }}
            >
              <img
                src="/images/check_mark_green.png"
                alt="check_mark"
                className="Pricing-check-mark"
              />
              <Typography
                variant="body2"
                sx={{ color: "#fff", letterSpacing: 0.4, ml: 1, pt: 0.1 }}
              >
                {line}
              </Typography>
            </Box>
          ))}
        </ul>

        {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: "flex-end",
                        my: 2,
                    }}
                >
                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        className="Pricing-amount">
                        ${tier.product_price?.unit_amount / 100} /month
                    </Typography>
                </Box>
                <ul>
                    {tier.description.map((line: any, index: any) => (
                        <Box key={index} sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
                            <img src="/images/check_mark_green.png" alt="check_mark" className="Pricing-check-mark" />
                            <Typography variant='body2' sx={{ color: "#fff", letterSpacing: 0.4, ml: 1, pt: 0.1 }}>
                                {line}
                            </Typography>
                        </Box>
                    ))}
                </ul> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            my: 2,
          }}
        >
          <Button
            fullWidth
            sx={{ borderRadius: "12px" }}
            onClick={() => handleChoosePlan(tier)}
            disabled={getButtonFlag(tier, currentPlan)}
            className={
              tier.id == currentPlan?.id ||
              tier.paypal_plan_id == currentPlan?.plan_id ||
              (!currentPlan &&
                tier.id == customerData?.subscription_detail[0]?.product_id) ||
              (!currentPlan &&
                tier.paypal_plan_id ==
                  customerData?.subscription_detail[0]?.product_id)
                ? "Pricing-btn current-pricing-plan"
                : "Pricing-btn"
            }
            variant="contained"
          >
            <strong>{getButtonLabel(tier, currentPlan)}</strong>
          </Button>

          {getCancelationButton(tier, currentPlan)}

          <Typography
            variant="body2"
            noWrap
            component="div"
            className="Pricing-amount"
          >
            {/* ${amount} / Month */}${amount}
            {/* ${Number(tier.product_price?.unit_amount / 100).toFixed(2)} /month */}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
