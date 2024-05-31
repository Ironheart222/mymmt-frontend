import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ChildParam,
  ForgotPassword,
  ParentParam,
  ParentSetting,
  PasswordType,
  ResetPassword,
  ThunkParam,
} from "../Interface";
import Router from "next/router";
import {
  notificationFail,
  notificationSuccess,
} from "../slices/notificationSlice";
import {
  AffiliateData,
  ChildData,
  ForgotPasswordData,
  ParentAuthData,
  ParentProfileData,
  ResetPasswordData,
} from "../slices/parentSlice";
import {
  mutateCreateParentAuth,
  mutateCreateAddUpdateChild,
  mutateForgotPassword,
  mutateResetPassword,
  mutateCreateEditProfile,
  mutateCreateGetParentById,
  mutateCreateGetAffiliateDetails,
  mutateCreateSentInvitationLink,
  mutateCreateUpdateParentEmail,
  mutateCreateSendLinkToNewEmail,
  mutateCreateUpdatePassword,
  mutateGetSubscriptionDetails,
} from "../query/parent";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { getParentList } from "./admin/adminAuthThunk";
import { getAllChildInfo, getSingleChildInfo } from "./childThunk";
import { logout } from "../slices/userSlice";
import { verifyPurchasedPlan } from "./subscription";

export const parentAuthentication = createAsyncThunk(
  "parent-setting/auth",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateParentAuth(_request, userClient)
      .then((res) => {
        if (res?.data?.parentSettingAuth?.status === "true") {
          dispatch(ParentAuthData(res.data.parentSettingAuth));
          dispatch(notificationSuccess(res.data.parentSettingAuth.message));
          localStorage.setItem(
            "parent-token",
            JSON.stringify(res.data.parentSettingAuth.data.token)
          );
        }
        result({
          status: res?.data?.parentSettingAuth?.status,
          message: res.data.parentSettingAuth?.message,
        });
      })
      .catch((e: any) => {
        console.log(e.message);
        result({
          status: "false",
          message: e.message,
        });
        // dispatch(notificationFail(e.message));
      });
  }
);

export const addUpdateChild = createAsyncThunk(
  "addchild",
  async (
    { _request, userUploadClient, userClient, result }: any,
    { dispatch }
  ) => {
    await mutateCreateAddUpdateChild(_request, userUploadClient)
      .then((res) => {
        if (res?.data?.addUpdateChild?.status === "true") {
          // dispatch(getSingleChildInfo({ _request: Number(res.data.addUpdateChild.data.child_id), userClient }))

          // console.log("_request",_request);

          if (_request.child_id == "") {
            dispatch(getAllChildInfo(userClient));
          }

          localStorage.setItem(
            "profile_pic",
            _request.profile_image_url ? _request.profile_image_url : ""
          );
          localStorage.setItem("is_child", "true");

          dispatch(notificationSuccess(res.data.addUpdateChild.message));
          result({ status: "true", message: res.data.addUpdateChild.message });
          // return true;
        } else {
          dispatch(notificationFail(res.data.addUpdateChild.message));
          result({ status: "false", message: "" });
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

export const forgotPassword = createAsyncThunk(
  "forgot-password",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateForgotPassword(_request, userClient)
      .then((res) => {
        if (res?.data?.forgotPassword?.status === "true") {
          dispatch(ForgotPasswordData(res.data.forgotPassword));
          dispatch(notificationSuccess(res.data.forgotPassword.message));
          if (_request.password_type == PasswordType.LOGIN_PASSWORD) {
            Router.replace("/login");
          }
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const resetPassword = createAsyncThunk(
  "reset-password",
  async ({ _request, userClient }: ThunkParam, { dispatch }) => {
    await mutateResetPassword(_request, userClient)
      .then((res) => {
        if (res?.data?.resetPassword?.status === "true") {
          dispatch(ResetPasswordData(res.data.resetPassword.data));
          dispatch(notificationSuccess(res.data.resetPassword.message));
          if (_request.password_type == PasswordType.LOGIN_PASSWORD) {
            Router.replace("/login");
          } else if (_request.password_type == PasswordType.SETTING_PASSWORD) {
            Router.replace("/parentportal");
          }
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const editParentProfile = createAsyncThunk(
  "edit-profile",
  async ({ _request, client, result }: any, { dispatch }) => {
    await mutateCreateEditProfile(_request, client)
      .then((res) => {
        if (res?.data?.editParentProfile?.status === "true") {
          dispatch(getParentList(client));
          // dispatch(getParentById({_request:_request.parent_id,client: client}));
          dispatch(notificationSuccess(res.data.editParentProfile.message));
          result({ status: "true", message: "Edit Parent successfully" });
        }
        result({ status: "false", message: "" });
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const getParentById = createAsyncThunk(
  "parent-profile-by-id",
  async ({ _request, client }: any, { dispatch }) => {
    await mutateCreateGetParentById(_request, client)
      .then((res) => {
        if (res?.data?.getParentById) {
          dispatch(ParentProfileData(res?.data?.getParentById));
        }
      })
      .catch((e: any) => {
        dispatch(notificationFail(e.message));
      });
  }
);

export const getAffiliateDetail = createAsyncThunk(
  "affiliate-detail",
  async (userClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateGetAffiliateDetails(userClient)
      .then((res) => {
        if (res?.data?.getAffiliateDetail.status === "true") {
          dispatch(AffiliateData(res?.data?.getAffiliateDetail.data));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const sentInvitationLink = createAsyncThunk(
  "sent_invitation_link",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateSentInvitationLink(_request, userClient)
      .then((res) => {
        if (res?.data?.sendInvitationLink.status === "true") {
          dispatch(notificationSuccess(res.data.sendInvitationLink.message));
          result({
            status: "true",
            message: "Invitation link sent successfully",
          });
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
        result({ status: "false", message: "" });
      });
  }
);

export const sendLinkToNewEmail = createAsyncThunk(
  "update_parent_email",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await mutateCreateSendLinkToNewEmail(_request, userClient)
      .then((res) => {
        if (res?.data?.resendNewEmail.status === "true") {
          dispatch(notificationSuccess(res.data.resendNewEmail.message));
          result({ status: "true", message: res.data.resendNewEmail.message });
        } else {
          dispatch(notificationFail(res.data.resendNewEmail.message));
          result({ status: "false", message: res.data.resendNewEmail.message });
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const updateParentEmail = createAsyncThunk(
  "update_parent_email",
  async ({ _request, userClient }: any, { dispatch }) => {
    await mutateCreateUpdateParentEmail(_request, userClient)
      .then((res) => {
        if (res?.data?.editParentEmail.status === "true") {
          dispatch(notificationSuccess(res.data.editParentEmail.message));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const updatePassword = createAsyncThunk(
  "update_password",
  async ({ _request, userClient }: any, { dispatch }) => {
    await mutateCreateUpdatePassword(_request, userClient)
      .then((res: any) => {
        if (res?.data?.updatePassword.status === "true") {
          dispatch(notificationSuccess(res.data.updatePassword.message));
          // result({status: "true", message: res.data.updatePassword.message})
        } else {
          dispatch(notificationFail(res.data.updatePassword.message));
          // result({status: "false", message: res.data.resendNewEmail.message})
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const getSubscriptionDetails = createAsyncThunk(
  "subscription-detail",
  async ({ _request, userClient }: any, { dispatch }) => {
    await mutateGetSubscriptionDetails(_request, userClient)
      .then((res) => {
        dispatch(getParentById({ _request: "", client: userClient }));
        dispatch(verifyPurchasedPlan(userClient));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);
