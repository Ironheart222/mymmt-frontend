import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  notificationFail,
  notificationSuccess,
} from "../../slices/notificationSlice";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { adminLogout } from "../../slices/admin/adminAuthSlice";
import {
  mutateAddUpdatePlan,
  mutateCreateGetSubscriptionList,
  queryCreateGetPlanById,
  queryGetPaypalPaymentByPlanId,
  queryGetSubscriptionPlanList,
} from "../../query/admin/subscription";
import {
  GetSubscriptionList,
  GetSubscriptionPlanById,
  GetSubscriptionPlanList,
  SetLoading,
} from "../../slices/admin/subscription";
import { logout } from "../../slices/userSlice";

export const getSubscriptionList = createAsyncThunk(
  "admin/get_subscription",
  async (adminClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateGetSubscriptionList(adminClient)
      .then((res) => {
        if (res?.data?.getSubscriptionList.status === "true") {
          dispatch(GetSubscriptionList(res.data.getSubscriptionList.data));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const getSubscriptionPlanList = createAsyncThunk(
  "admin/get_subscription_plan",
  async (client: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await queryGetSubscriptionPlanList(client)
      .then((res) => {
        if (res?.data?.getSubscriptionPlanList.status === "true") {
          dispatch(
            GetSubscriptionPlanList(res.data.getSubscriptionPlanList.data)
          );
        }
        dispatch(SetLoading(false));
      })
      .catch((e: any) => {
        dispatch(SetLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

export const addUpdateSubscriptionPlan = createAsyncThunk(
  "admin/add_discount",
  async ({ _request, adminClient, result }: any, { dispatch }) => {
    await mutateAddUpdatePlan(_request, adminClient)
      .then((res) => {
        if (res?.data?.addUpdatePlan?.status === "true") {
          dispatch(getSubscriptionPlanList(adminClient));
          result({ status: "true", message: res.data.addUpdatePlan.message });
          dispatch(notificationSuccess(res.data.addUpdatePlan.message));
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

export const getSubscriptionPlanById = createAsyncThunk(
  "admin/plan_by_id",
  async ({ _request, client }: any, { dispatch }) => {
    await queryCreateGetPlanById(_request, client)
      .then((res) => {
        if (res?.data?.getSubscriptionPlanById?.status === "true") {
          dispatch(
            GetSubscriptionPlanById(res?.data?.getSubscriptionPlanById.data)
          );
          // result({ status: "true", message: res.data.addUpdatePlan.message })
        }
      })
      .catch((e: any) => {
        if (
          e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED"
        ) {
          dispatch(adminLogout());
          dispatch(logout());
        }
        // result({ status: "false", message: "" })
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const getPaypalPaymentDetails = createAsyncThunk(
  "admin/paypal_plan_request",
  async ({ _request, userClient, result }: any, { dispatch }) => {
    await queryGetPaypalPaymentByPlanId(_request, userClient)
      .then((res) => {
        if (res?.data?.addSubscriptionPlans?.status === "true") {
          window.location.href = res?.data?.addSubscriptionPlans.data;
        } else {
          dispatch(notificationFail(res?.data?.addSubscriptionPlans?.message));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      })
      .finally(() => {
        result({ status: "true" });
      });
  }
);
