import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  mutateCancelSubscriptionPlan,
  mutateCreateDetachPaymentMethod,
  mutateCreateGetStripeCustomerDetail,
  mutateCreateSetCardAsDefault,
  mutateCreateSubscriptionPlan,
  mutateCreateUpdateCreditCard,
  mutateCreateVerifyDiscountCode,
  mutateCreateVerifyPurchasePlan,
  mutateGetUpcomingPlan,
} from "../query/subscription";
import {
  notificationFail,
  notificationSuccess,
} from "../slices/notificationSlice";
import {
  SetComponentLoading,
  SetButtonLoading,
  StripeCustomerDetail,
  DiscountDetail,
  PurchasedPlan,
  UpcomingPlan
} from "../slices/subscriptionSlice";
import { logout } from "../slices/userSlice";

/** update credit card */
export const updateCreditCardDetail = createAsyncThunk(
  "stripe/update_credit_card",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    dispatch(SetButtonLoading(true));
    await mutateCreateUpdateCreditCard(_request, userClient)
      .then((res) => {
        if (res?.data?.updateCreditCard?.status === "true") {
          // dispatch(ParentAuthData(res.data.parentSettingAuth));
          dispatch(gettingCustomerStripeDetail(userClient));
          dispatch(SetButtonLoading(false));
          dispatch(notificationSuccess(res.data.updateCreditCard.message));
          // closeModal();
          result({ status: "true", data: res?.data?.updateCreditCard?.data });
        } else {
          dispatch(notificationSuccess("Something went wrong, Please retry"));
          dispatch(SetButtonLoading(false));
          result({ status: "false", data: null });
        }
      })
      .catch((e: any) => {
        result({ status: "false", data: null });
        dispatch(SetButtonLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

/** getting stripe customer detail */
export const gettingCustomerStripeDetail = createAsyncThunk(
  "stripe/getting_stripe_customer_detail",
  async (userClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    dispatch(SetComponentLoading(true));
    await mutateCreateGetStripeCustomerDetail(userClient)
      .then((res) => {
        dispatch(SetComponentLoading(false));
        if (res?.data?.getStripeCustomerDetail?.status === "true") {
          dispatch(
            StripeCustomerDetail(res?.data?.getStripeCustomerDetail.data)
          );
        }
      })
      .catch((e: any) => {
        dispatch(SetComponentLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

/** detch payment method */
export const detchPaymentMethod = createAsyncThunk(
  "stripe/detch_payment_method",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateDetachPaymentMethod(_request, userClient)
      .then((res) => {
        if (res?.data?.detachPaymentMethod?.status === "true") {
          dispatch(gettingCustomerStripeDetail(userClient));
          dispatch(
            notificationSuccess(res?.data?.detachPaymentMethod?.message)
          );
          result({
            status: "true",
            message: res?.data?.detachPaymentMethod?.message,
          });
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

/** set payment method as default */
export const setCardAsDefault = createAsyncThunk(
  "stripe/set_card_as_default",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateSetCardAsDefault(_request, userClient)
      .then((res) => {
        if (res?.data?.setCardAsDefault?.status === "true") {
          result({
            status: "true",
            message: res?.data?.setCardAsDefault?.message,
          });
          dispatch(gettingCustomerStripeDetail(userClient));
          dispatch(notificationSuccess(res?.data?.setCardAsDefault?.message));
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

/** verify discount code */
export const verifyDiscountCode = createAsyncThunk(
  "stripe/verify_discount_code",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateVerifyDiscountCode(_request, userClient)
      .then((res) => {
        if (res?.data?.verifyDiscountCode?.status === "true") {
          result({
            status: "true",
            message: res?.data?.verifyDiscountCode?.message,
          });
          dispatch(DiscountDetail(res?.data?.verifyDiscountCode?.data));
          dispatch(notificationSuccess(res?.data?.verifyDiscountCode?.message));
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: e.message });
        dispatch(DiscountDetail({}));
        dispatch(notificationFail(e.message));
      });
  }
);

/** upgrade subscription plan */
export const getUpcomingSubscription = createAsyncThunk(
  "subsciption_plan/upcoming_subsciption",
  async (userClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateGetUpcomingPlan(userClient)
      .then((res) => {
        console.log("res", res?.data?.getUpcomingSubscription?.status );
        if (res?.data?.getUpcomingSubscription?.status === "true") {
          dispatch(UpcomingPlan(res?.data?.getUpcomingSubscription));
        }
      })
      .catch((e: any) => {
        dispatch(UpcomingPlan({}));
        dispatch(notificationFail(e.message));
      });
  }
);

/** upgrade subscription plan */
export const upgradeSubscriptionPlan = createAsyncThunk(
  "stripe/upgrade_plan",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateSubscriptionPlan(_request, userClient)
      .then((res) => {
        if (res?.data?.upgradeSubscriptionPlan?.status === "true") {
          // dispatch(ParentAuthData(res.data.parentSettingAuth));
          result({
            status: "true",
            message: res?.data?.upgradeSubscriptionPlan?.message,
          });
          dispatch(gettingCustomerStripeDetail(userClient));
          dispatch(
            notificationSuccess(res.data.upgradeSubscriptionPlan.message)
          );
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: e.message });
        dispatch(notificationFail(e.message));
      });
  }
);

/** verify purchase plan */
export const verifyPurchasedPlan = createAsyncThunk(
  "stripe/verify_purchase_plan",
  async (userClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateVerifyPurchasePlan(userClient)
      .then((res) => {
        if (res?.data?.verifyPurchasedPlan?.status === "true") {
          // dispatch(DiscountDetail(res?.data?.verifyDiscountCode?.data));
          dispatch(PurchasedPlan(res?.data?.verifyPurchasedPlan));
          // dispatch(notificationSuccess(res?.data?.verifyPurchasedPlan?.message));
        } else {
          dispatch(PurchasedPlan({}));
          // dispatch(notificationFail(res?.data?.verifyPurchasedPlan?.message));
        }
      })
      .catch((e: any) => {
        dispatch(notificationFail(e.message));
      });
  }
);

/** cancel membership plan */
export const cancelMembershipPlan = createAsyncThunk(
  "stripe/cancel_membership_plan",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCancelSubscriptionPlan(_request, userClient)
      .then((res) => {
        if (res?.data?.cancelSubscribeStripePlan?.status === "true") {
          result({
            status: "true",
            message: res?.data?.cancelSubscribeStripePlan?.message,
          });
          dispatch(gettingCustomerStripeDetail(userClient));
          dispatch(
            notificationSuccess(res.data.cancelSubscribeStripePlan.message)
          );
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: e.message });
        dispatch(notificationFail(e.message));
      });
  }
);
