import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  notificationFail,
  notificationSuccess,
} from "../../slices/notificationSlice";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  mutateCreateAddDiscountCode,
  mutateCreateDeleteDiscountCode,
  mutateCreateGetDiscountList,
} from "../../query/admin/discount";
import { GetDiscountCodeList } from "../../slices/admin/DiscountSlice";
import { adminLogout } from "../../slices/admin/adminAuthSlice";
import {
  mutateCreateAddResouceFolder,
  mutateCreateGetResourceFolderList,
  mutateCreateAddResouceFolderDocuments,
  queryGetResourceFolderDetailByFolderId,
  queryGetVideoForMapping,
  mutateFolderDeleteFiles,
} from "../../query/admin/resources";
import {
  AddResourceFolder,
  GetResourceFolderList,
  AddResourceFolderDocuments,
  GetResourceFolderDetail,
  GetVideoListFromVdocipher,
} from "../../slices/admin/resourceSlice";
import { setLoading } from "../../slices/loadingSlice";

export const addResourcesFolder = createAsyncThunk(
  "admin/add_resource_folder",
  async ({ _request, adminClient, result }: any, { dispatch }) => {
    await mutateCreateAddResouceFolder(_request, adminClient)
      .then((res) => {
        if (res?.data?.addResourceFolder?.status === "true") {
          dispatch(AddResourceFolder(adminClient));
          dispatch(getResourcesFolder(adminClient));
          if (_request?.is_delete_call) {
            dispatch(notificationSuccess("Folder deleted successfully"));
          } else if (_request?.is_active_call) {
            dispatch(
              notificationSuccess(
                `Folder ${
                  _request.is_active ? "Activated" : "Deactivated"
                } successfully`
              )
            );
          } else {
            dispatch(notificationSuccess(res.data.addResourceFolder.message));
          }

          dispatch(setLoading(false));
          result({
            status: "true",
            message: res.data.addResourceFolder.message,
          });
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

export const getResourcesFolder = createAsyncThunk(
  "admin/get_resouce_folder",
  async (adminClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
    await mutateCreateGetResourceFolderList(adminClient)
      .then((res) => {
        dispatch(GetResourceFolderList(res.data.getResourceFolderList));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const addResourcesFolderDocuments = createAsyncThunk(
  "admin/add_resource_folder_documents",
  async (
    { _request, adminClient, uploadClient, result }: any,
    { dispatch }
  ) => {
    await mutateCreateAddResouceFolderDocuments(_request, uploadClient)
      .then((res) => {
        if (res?.data?.addFolderDocuments?.status === "true") {
          dispatch(AddResourceFolderDocuments(adminClient));
          dispatch(notificationSuccess(res.data.addFolderDocuments.message));
          result({
            status: "true",
            message: res.data.addFolderDocuments.message,
          });
        }
      })
      .catch((e: any) => {
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);

export const getResourceFolderDetailByFolderId = createAsyncThunk(
  "admin/resource_folder_details_by_id",
  async (reqObj: any, { dispatch }) => {
    await queryGetResourceFolderDetailByFolderId(
      reqObj._request,
      reqObj.adminClient || reqObj.userClient
    )
      .then((res) => {
        dispatch(GetResourceFolderDetail(res?.data?.getResourceFolderDetail));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      })
      .finally(() => {
        if (reqObj.result) {
          reqObj.result({ status: "true" });
        }
      });
  }
);

export const getVideoForMapping = createAsyncThunk(
  "admin/get_video_from_vdocipher",
  async ({ _request, adminClient }: any, { dispatch }) => {
    await queryGetVideoForMapping(_request, adminClient)
      .then((res) => {
        dispatch(GetVideoListFromVdocipher(res.data.getVideoForMapping.data));
      })
      .catch((e: any) => {
        console.log(e.message);
        dispatch(notificationFail(e.message));
      });
  }
);

export const deleteFolderDocument = createAsyncThunk(
  "admin/delete_folder_document",
  async ({ _request, adminClient, result }: any, { dispatch }) => {
    await mutateFolderDeleteFiles(_request, adminClient)
      .then((res) => {
        console.log("Response Delete", res);
        if (res?.data?.deleteResourceDocument?.status == "true") {
          result({
            status: "true",
            message: res?.data?.deleteResourceDocument.message,
          });

          dispatch(
            notificationSuccess(res.data.deleteResourceDocument.message)
          );
        }
      })
      .catch((e: any) => {
        console.log(e.message);
        result({ status: "false", message: "" });
        dispatch(notificationFail(e.message));
      });
  }
);
