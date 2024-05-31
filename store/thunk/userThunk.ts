import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  mutateCreateCheckLinkExpire,
  mutateCreateEmailVerification,
  // mutateCreateAddChild,
  mutateCreateLogin,
  mutateCreateRegister,
  mutateTrialUserRegister,
  mutateCreateResendEmail,
  mutateCancelMembership,
  mutateUpdateSubcription,
} from "../query/user";
import {
  LinkExpire,
  LoginParam,
  RegisterParam,
  ResponseData,
  ThunkParam,
} from "../Interface";
import {
  EmailVerificaionData,
  LinkExpireData,
  // ChildData,
  LoginData,
  RegisterData,
  ResendEmailData,
} from "../slices/userSlice";
import Router from "next/router";
import {
  notificationFail,
  notificationSuccess,
} from "../slices/notificationSlice";
import { setLoading } from "../slices/loadingSlice";

export const createLogin = createAsyncThunk(
  "login",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateCreateLogin(_request, userClient)
      .then((res) => {
        if (res?.data?.login?.status === "true") {
          dispatch(LoginData(res.data.login));

          localStorage.setItem(
            "user_token",
            JSON.stringify(res.data.login.data.token)
          );

          localStorage.setItem("parent_name", res.data.login.data.parent_name);

          localStorage.setItem(
            "plan_purchased_status",
            res.data.login.data.isPlanPurchase
          );

          localStorage.setItem("is_child", res.data.login.data.is_child);

          localStorage.setItem(
            "welcome_text",
            res.data.login.data.first_time_logging
          );

          if (res.data.login.data.first_time_logging) {
            localStorage.setItem("parent-token", "true");
          }

          if (!res.data.login.data.isPlanPurchase) {
            Router.replace("/parentportal/subscription-plan");
          } else if (res.data.login.data.is_child) {
            Router.replace("/select-profile");
          } else {
            Router.replace("/parentportal");
          }

          dispatch(notificationSuccess(res.data.login.message));
        }
      })
      .catch((e: any) => {
        // console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const registerUser = createAsyncThunk(
  "register",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateCreateRegister(_request, userClient)
      .then((res) => {
        if (res?.data?.signup?.status === "true") {
          dispatch(RegisterData(res.data.signup));
          Router.replace(`/signup/${_request.email}`);
          dispatch(notificationSuccess(res.data.signup.message));
        } else {
          dispatch(notificationFail(res?.data?.signup?.message));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const resendEmail = createAsyncThunk(
  "resend_email",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateCreateResendEmail(_request, userClient)
      .then((res) => {
        if (res?.data?.resendEmail?.status === "true") {
          dispatch(ResendEmailData(res.data.resendEmail));
          dispatch(notificationSuccess(res.data.resendEmail.message));
        } else {
          dispatch(notificationFail(res?.data?.resendEmail?.message));
        }
        dispatch(setLoading(false));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(setLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

export const isLinkExpire = createAsyncThunk(
  "link_expire",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateCreateCheckLinkExpire(_request, userClient)
      .then((res) => {
        if (res?.data?.isLinkExpired?.status === "true") {
          dispatch(LinkExpireData(res.data.isLinkExpired));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const emailVerification = createAsyncThunk(
  "email_verification",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateEmailVerification(_request, userClient)
      .then((res) => {
        if (res?.data?.emailVerification?.status === "true") {
          dispatch(EmailVerificaionData(res.data.emailVerification));
          dispatch(notificationSuccess(res?.data?.emailVerification?.message));
          result({ status: "true", data: res?.data?.updateCreditCard?.data });
        } else {
          result({ status: "false", data: res?.data?.emailVerification?.data });
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
        result({ status: "false", data: null });
      });
  }
);

export const registerTrialUser = createAsyncThunk(
  "register-trial",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateTrialUserRegister(_request, userClient)
      .then((res) => {
        if (res?.data?.trialSignup?.status === "true") {
          if (_request.payment_gateway_type == "paypal") {
            window.location.href = res?.data?.trialSignup?.data?.paypal_url;
          } else if (_request.payment_gateway_type == "stripe") {
            Router.replace(`/signup/${_request.email}`);
          }
          dispatch(notificationSuccess(res.data.trialSignup.message));
          result({ status: "true", data: res?.data?.trialSignup });
        } else {
          dispatch(notificationFail(res?.data?.trialSignup?.message));
          result({ status: "false", data: null });
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        result({ status: "false", data: null });
        dispatch(notificationFail(e.message));
      });
  }
);

export const cancelMembership = createAsyncThunk(
  "cancel_membership",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateCancelMembership(_request, userClient)
      .then((res) => {
        if (res?.data?.unsubscribeStripePlan?.status === "true") {
          dispatch(notificationSuccess(res.data.unsubscribeStripePlan.message));
          window.location.href =
            "https://www.my5mt.com/my-5-minute-maths-tutor-membership-plans";
        } else {
          dispatch(notificationFail(res?.data?.unsubscribeStripePlan?.message));
        }
        dispatch(setLoading(false));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(setLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

export const updateSubcription = createAsyncThunk(
  "update-subscription",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateUpdateSubcription(_request, userClient)
      .then((res) => {
        if (res?.data?.updateSubcription?.status === "true") {
          dispatch(notificationSuccess(res.data.updateSubcription.message));
          result({ status: "true", data: res?.data?.updateSubcription });
        } else {
          dispatch(notificationFail(res?.data?.updateSubcription?.message));
          result({ status: "false", data: res?.data?.updateSubcription });
        }
        dispatch(setLoading(false));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(setLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);
