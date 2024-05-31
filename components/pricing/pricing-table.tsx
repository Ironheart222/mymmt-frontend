import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import * as React from "react";
// import { styled } from '@mui/material/styles';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PlanConfirmationModel from "../model/plan-confirmation-model";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { DiscountDetail } from "../../store/slices/subscriptionSlice";
import {
  gettingCustomerStripeDetail,
  upgradeSubscriptionPlan,
  cancelMembershipPlan,
  getUpcomingSubscription,
} from "../../store/thunk/subscription";
import { ApolloClientType, DialogDetails } from "../../store/Interface";
import SelectPaymentModel from "../model/select-method-model";
import SelectPaymentMethodModel from "../model/select-payment-method-model";
import AddCardDetailModal from "../model/add-card-details-model";
import PlanCardLayout from "./plan-card-layout";
import CompleteSubscriptionModel from "../model/complete-subscription-model";
import { getSubscriptionPlanList } from "../../store/thunk/admin/subscription";
import { SetLoading } from "../../store/slices/admin/subscription";
import { notificationFail } from "../../store/slices/notificationSlice";
import ConfirmationModel from "../parentportal/confirmation-model";

// const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
//     backgroundColor: "white",
//     // border: "1px solid #d3d3d3",
//     '& .MuiToggleButtonGroup-grouped': {
//         margin: theme.spacing(0.5),
//         border: 0,
//         '&.Mui-disabled': {
//             border: 0,
//         },
//         '&.Mui-selected': {
//             backgroundColor: "#99fc31"
//         },
//         '&:not(:first-of-type)': {
//             borderRadius: theme.shape.borderRadius,
//         },
//         '&:first-of-type': {
//             borderRadius: theme.shape.borderRadius,
//         },
//     },
// }));

function PricingTable() {
  const dispatch = useAppDispatch();
  const { stripeCustomerDetail, componentLoading, upcomingPlan } = useAppSelector(
    (state) => state.subscriptionSlice
  );
  const { userClient }: ApolloClientType = useAppSelector(
    (state) => state.apolloClientReducer
  );
  const { subscriptionPlanList, loading } = useAppSelector(
    (state) => state.adminSubscriptionSlice
  );

  const [openMembershipConfirmationModel, setOpenMembershipConfirmationModel] =
    React.useState<boolean>(false);

  const [dialogDetails, setDialogDetails] = React.useState<DialogDetails>({
    title: "",
    body_content: "",
    id: "",
  });

  // const [alignment, setAlignment] = React.useState('monthly');
  const [listLoading, setListLoading] = React.useState<boolean>(false);
  const [openCardDetail, setOpenCardDetail] = React.useState<boolean>(false);
  const [openSuccessModel, setSuccessModel] = React.useState<boolean>(false);
  const [openSelectPaymentModel, setSelectPaymentModel] =
    React.useState<boolean>(false);
  const [openSelectPaymentMethodModel, setSelectPaymentMethodModel] =
    React.useState<boolean>(false);
  const [openCompletionModel, setOpenCompletionModel] =
    React.useState<boolean>(false);
  // const [showError, setShowError] = React.useState<boolean>(false);
  const [openConfirmationModel, setOpenConfirmationModel] =
    React.useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>({});
  const [upcomingPlanData, setUpcomingPlanData] = React.useState<any>({});
  const [customerDetail, setCustomerDetail] = React.useState<any>("");
  const [defaultPaymentMethod, setDefaultPaymentMethod] =
    React.useState<any>("");
  const [planList, setPlanList] = React.useState<any>([]);
  const [currentPlan, setCurrentPlan] = React.useState<any>(null);
  const [currentPlanIndex, setCurrentPlanIndex] = React.useState<any>(null);
  const [upgradePlanData, setUpgradePlanData] = React.useState<any>(null);
  const [cancellationLoader, setCancellationLoader] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(SetLoading(true));
    dispatch(getSubscriptionPlanList(userClient));
    dispatch(gettingCustomerStripeDetail(userClient));
    dispatch(getUpcomingSubscription(userClient))
  }, []);

  React.useEffect(() => {
    setListLoading(loading);
  }, [loading]);

  React.useEffect(() => {
    setPlanList(subscriptionPlanList);
  }, [subscriptionPlanList]);

  React.useEffect(() => {
    setUpcomingPlanData(upcomingPlan?.data || {});
  },[upcomingPlan?.data])

  // React.useEffect(() => {
  //     if (showError) {
  //         window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  //     }
  // }, [showError]);

  React.useEffect(() => {
    if (stripeCustomerDetail && Object.keys(stripeCustomerDetail).length > 0) {
      setCustomerDetail(stripeCustomerDetail);
    } else {
      setCustomerDetail("");
    }
  }, [stripeCustomerDetail]);

  const toggleConfirmationModel = () => {
    if (
      customerDetail &&
      customerDetail.paymentMethods &&
      customerDetail.paymentMethods.length <= 0
    ) {
      setSelectPaymentModel(true);
      return;
    }
    // if (tier) {
    //     setSelectedPlan(tier);
    // }
    dispatch(DiscountDetail({}));
    setOpenConfirmationModel(!openConfirmationModel);
  };

  const toggleSelectePlan = (tier: any) => {
    if (tier) {
      setSelectedPlan(tier);
    }
  };

  const toggleSuccessModel = () => {
    setSuccessModel(!openSuccessModel);
  };

  const toggleSelectPaymentModel = () => {
    setSelectPaymentModel(!openSelectPaymentModel);
    setSelectPaymentMethodModel(false);
  };

  const toggleSelectPaymentMethodModel = () => {
    setSelectPaymentMethodModel(!openSelectPaymentMethodModel);
    // toggleConfirmationModel();
    setOpenConfirmationModel(false);
  };

  const toggleCardDetail = () => {
    setOpenCardDetail(!openCardDetail);
  };

  const handleProceedPlanPurchase = (
    id: string,
    callBackFunc: (status: boolean) => void
  ) => {
    if (!id || id == "") {
      dispatch(notificationFail("Please add payment method"));
      return false;
    }

    const requestPlan = {
      paymentData: {
        ...upgradePlanData.paymentData,
        defaultPaymentMethod: id,
      },
    };

    if (Object.keys(requestPlan).length > 0) {
      dispatch(
        upgradeSubscriptionPlan({
          _request: requestPlan,
          userClient,
          result: (res: any) => {
            callBackFunc(false);
            toggleSelectPaymentModel();
          },
        })
      );
    }
  };

  const handleCancelMemberShipConfirm = () => {
    let dialogDetails: DialogDetails = {
      title: "Cancel Confirmation",
      body_content: "Are you sure you want to cancel membership?",
      id: "",
    };
    setDialogDetails(dialogDetails);
    setOpenMembershipConfirmationModel(!openConfirmationModel);
  };

  const handleCancelMemberShipClose = () => {
    setDialogDetails({
      title: "",
      body_content: "",
      id: "",
    });
    setOpenMembershipConfirmationModel(false);
  };

  const handleCancelMemberShipProcceed = () => {
    setCancellationLoader(true);
    const requestCancelPlan = {
      subscription_id:
        customerDetail?.CustomerDetail?.subscription_detail[0]?.subscription_id,
      subscription_type:
        customerDetail?.CustomerDetail?.subscription_detail[0]
          ?.subscription_type,
    };

    dispatch(
      cancelMembershipPlan({
        _request: requestCancelPlan,
        userClient,
        result: (res: any) => {
          setCancellationLoader(false);
          setOpenMembershipConfirmationModel(false);
        },
      })
    );
  };

  const handleDefaultPayment = (id: string) => {
    // setDefaultPaymentMethod(id);
    // toggleSelectPaymentModel();
    toggleConfirmationModel();
  };

  const toggleCompletionModel = () => {
    setOpenCompletionModel(!openCompletionModel);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        my: {
          lg: 4,
          md: 4,
          sm: 4,
          xs: 1,
        },
      }}
    >
      {openConfirmationModel && (
        <PlanConfirmationModel
          open={openConfirmationModel}
          onClose={toggleConfirmationModel}
          selectedPlan={selectedPlan}
          toggleSuccessModel={toggleCompletionModel}
          defaultPaymentMethod={defaultPaymentMethod}
          toggleSelectPaymentMethod={toggleSelectPaymentMethodModel}
          setUpgradePlanDataFunc={setUpgradePlanData}
          stripePaymentMethod={toggleSelectPaymentModel}
        />
      )}
      {openCompletionModel && (
        <CompleteSubscriptionModel
          open={openCompletionModel}
          onClose={toggleCompletionModel}
        />
      )}
      {openSelectPaymentModel && (
        <SelectPaymentModel
          open={openSelectPaymentModel}
          onClose={toggleSelectPaymentModel}
          toggleCardModel={toggleCardDetail}
          // onProceed={handleDefaultPayment}
          onProceed={handleProceedPlanPurchase}
        />
      )}
      {openSelectPaymentMethodModel && (
        <SelectPaymentMethodModel
          open={openSelectPaymentMethodModel}
          onClose={toggleSelectPaymentMethodModel}
          toggleCardModel={toggleCardDetail}
          onProceed={handleDefaultPayment}
          stripePaymentMethod={toggleSelectPaymentModel}
          selectedPlan={selectedPlan}
          totalAmount={upgradePlanData?.totalAmount}
        />
      )}
      {openCardDetail && (
        <AddCardDetailModal
          onClose={toggleCardDetail}
          open={openCardDetail}
          paymentMethods={null}
        />
      )}
      {/* Single Plan Section Start */}
      <Container disableGutters component="main" sx={{ pb: 3 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            // pt: 8,
            pb: 3,
          }}
        >
          <Container maxWidth="sm">
            <Grid container sx={{ bgcolor: "#000", my: 2, p: 2, borderRadius: "8px"}}>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#99fc31"}}>
                  Your current membership
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#FFF"}}>
                  {upcomingPlanData?.currentMembership || ""}
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#99fc31"}}>
                  Your Payment cycle is
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#FFF"}}>
                  {upcomingPlanData?.paymentCycle || ""}
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#99fc31"}}>
                  Your next payment is due
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#FFF"}}>
                  {upcomingPlanData?.nextPaymentDate || ""}
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#99fc31"}}>
                  Your next payment amount
                </Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Typography
                  variant="body2"
                  noWrap
                  component="div"
                  sx={{color: "#FFF"}}>
                    {!isNaN(Number(upcomingPlanData?.nextPayment)) ? `$${upcomingPlanData?.nextPayment}` : upcomingPlanData?.nextPayment}
                </Typography>
              </Grid>
            </Grid>
            <Stack direction="row" justifyContent="center">
              <Button
                className="video-button"
                disableTouchRipple
                disableElevation
                variant="contained"
              >
                Single Child Membership
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* <Typography
                    variant="h6"
                    align="center"
                    color="text.primary"
                    gutterBottom
                    className='Pricing-caption'
                >
                    <strong>The difference between the two membership plans is simple.</strong>
                </Typography> */}
      </Container>

      {/* End hero unit */}
      {/* <Box
                justifyContent={"center"}
                sx={{
                    display: 'flex',
                    textAlign:"center",
                    flexWrap: 'wrap',
                    pb:4
                }}>
                <StyledToggleButtonGroup
                    size="small"
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label=""
                   >
                    <ToggleButton value="monthly" aria-label="monthly">
                        Monthly
                    </ToggleButton>
                    <ToggleButton value="yearly" aria-label="yearly">
                        Annual
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </Box> */}
      <Container>
        <Grid container spacing={5} justifyContent={"center"}>
          {listLoading && (
            <CircularProgress color={"inherit"} size={20} sx={{ mt: 4 }} />
          )}
          {!listLoading &&
            planList &&
            planList.map((tier: any, index: any) => {
              if (["a", "b", "c"].includes(tier?.trial_alias)) {
                return (
                  // Enterprise card is full width at sm breakpoint
                  <Grid item key={tier.id}>
                    <PlanCardLayout
                      tier={tier}
                      currentPlan={customerDetail?.currentPlan || null}
                      invoiceDetails={customerDetail?.invoice || null}
                      customerData={customerDetail?.CustomerDetail || null}
                      toggleSelectePlan={toggleSelectePlan}
                      toggleSelectMethod={toggleSelectPaymentModel}
                      toggleSelectPaymentMethod={toggleSelectPaymentMethodModel}
                      currentPlanType={customerDetail?.type || null}
                      setCurrentPlanIndexFunc={setCurrentPlanIndex}
                      currentPlanIndexValue={currentPlanIndex}
                      planIndex={index}
                      handleDefaultPaymentFunc={handleDefaultPayment}
                      cancelMemberShipFunc={handleCancelMemberShipConfirm}
                    />
                  </Grid>
                );
              }
            })}
        </Grid>
      </Container>
      {/* Single Plan Section End */}
      {/* Family Plan Section Start */}
      <Box
        sx={{
          bgcolor: "background.paper",
          // pt: 8,
          pb: 3,
        }}
      >
        <Container maxWidth="sm" sx={{ mt: "32px" }}>
          <Stack direction="row" justifyContent="center">
            <Button
              className="video-button"
              disableTouchRipple
              disableElevation
              variant="contained"
            >
              Family Membership
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container>
        <Grid container spacing={5} justifyContent={"center"}>
          {listLoading && (
            <CircularProgress color={"inherit"} size={20} sx={{ mt: 4 }} />
          )}
          {!listLoading &&
            planList &&
            planList.map((tier: any, index: any) => {
              if (["d", "e", "f"].includes(tier?.trial_alias)) {
                return (
                  // Enterprise card is full width at sm breakpoint
                  <Grid item key={tier.id}>
                    <PlanCardLayout
                      tier={tier}
                      currentPlan={customerDetail?.currentPlan || null}
                      invoiceDetails={customerDetail?.invoice || null}
                      toggleSelectePlan={toggleSelectePlan}
                      toggleSelectMethod={toggleSelectPaymentModel}
                      toggleSelectPaymentMethod={toggleSelectPaymentMethodModel}
                      currentPlanType={customerDetail?.type || null}
                      setCurrentPlanIndexFunc={setCurrentPlanIndex}
                      currentPlanIndexValue={currentPlanIndex}
                      planIndex={index}
                      handleDefaultPaymentFunc={handleDefaultPayment}
                      cancelMemberShipFunc={handleCancelMemberShipConfirm}
                    />
                  </Grid>
                );
              }
            })}
        </Grid>
      </Container>
      {/* Family Plan Section End */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          align="center"
          color="text.primary"
          gutterBottom
          className="Pricing-caption"
        >
          <strong>
            If you have a promotional code it will be added in the next step
          </strong>
        </Typography>
      </Box>
      {openMembershipConfirmationModel && (
        <ConfirmationModel
          loading={cancellationLoader}
          dialogDetails={dialogDetails}
          modelOpen={openMembershipConfirmationModel}
          onClose={handleCancelMemberShipClose}
          onDelete={handleCancelMemberShipProcceed}
        />
      )}
    </Box>
  );
}

export default PricingTable;
