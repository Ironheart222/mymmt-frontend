import { createAsyncThunk } from "@reduxjs/toolkit";
import Router from "next/router";
import { LoginParam, ThunkParam } from "../../Interface";
import {
  notificationFail,
  notificationSuccess,
} from "../../slices/notificationSlice";
import {
  mutateCreateAdminAuth,
  mutateCreateParentList,
  mutateCreateUpadateAdminDetail,
  mutateCreateUpadateParentStatus,
  mutateCreateGetAdminDetail,
} from "../../query/admin/adminAuth";
import {
  AdminAuthData,
  ParentListData,
  UpdateParentStatus,
  AdminProfileData,
  UpdateAdminData,
  adminLogout,
} from "../../slices/admin/adminAuthSlice";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { setLoading } from "../../slices/loadingSlice";
// import { adminClient } from '../../apolloClient';

export const createAdminLogin = createAsyncThunk(
  "admin/auth",
  async ({ _request, adminClient }: any, { dispatch }) => {
    await mutateCreateAdminAuth(_request, adminClient)
      .then((res) => {
        if (res?.data?.adminLogin?.status === "true") {
          dispatch(AdminAuthData(res.data.adminLogin));
          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              "admin_token",
              JSON.stringify(res.data.adminLogin.data.password)
            );
            Router.replace("/admin/dashboard");
          }
          dispatch(notificationSuccess(res.data.adminLogin.message));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const getParentList = createAsyncThunk(
  "parent_list",
  async (adminClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateParentList(adminClient)
      .then((res) => {
        if (res?.data?.getParentList) {
          dispatch(ParentListData(res.data.getParentList));
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        if (
          e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED"
        ) {
          dispatch(adminLogout());
        }
        dispatch(notificationFail(e.message));
      });
  }
);

export const updateParentStatus = createAsyncThunk(
  "parent/status",
  async ({ _request, adminClient, result }: any, { dispatch }) => {
    await mutateCreateUpadateParentStatus(_request, adminClient)
      .then((res) => {
        if (res?.data?.updateParentStatus?.status === "true") {
          // dispatch(UpdateParentStatus(res.data.updateParentStatus));
          if (_request?.is_delete_call) {
            dispatch(notificationSuccess("Parent deleted successfully"));
          } else {
            dispatch(notificationSuccess(res.data.updateParentStatus.message));
          }

          dispatch(getParentList(adminClient));
          dispatch(setLoading(false));
          if (result) {
            result({
              status: "true",
              message: res.data.updateParentStatus.message,
            });
          }
        }
      })
      .catch((e: any) => {
        if (result) {
          result({ status: "false", message: "" });
        }

        dispatch(setLoading(false));
        dispatch(notificationFail(e.message));
      });
  }
);

export const updateAdminDetail = createAsyncThunk(
  "admin/edit_detail",
  async ({ _request, adminClient, props }: any, { dispatch }) => {
    await mutateCreateUpadateAdminDetail(_request, adminClient)
      .then((res) => {
        if (res?.data?.updateAdminDetail?.status === "true") {
          dispatch(UpdateAdminData(res.data.updateAdminDetail));
          props.onClose();
          if (_request.old_password) {
            // adminLogout();
            dispatch(adminLogout());
            Router.replace("/admin/login");
          }
          dispatch(notificationSuccess(res.data.updateAdminDetail.message));
        }
      })
      .catch((e: any) => {
        dispatch(notificationFail(e.message));
      });
  }
);

export const getAdminDetail = createAsyncThunk(
  "admin/get_detail",
  async (adminClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateGetAdminDetail(adminClient)
      .then((res) => {
        if (res?.data?.getAdminDetail) {
          dispatch(AdminProfileData(res.data.getAdminDetail));
          dispatch(notificationSuccess(res.data.getAdminDetail.message));
        }
      })
      .catch((e: any) => {
        dispatch(notificationFail(e.message));
      });
  }
);
