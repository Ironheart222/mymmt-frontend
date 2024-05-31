import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { ResponseData } from "../../Interface";

interface IntialState {
  addResourceFolder: ResponseData | {};
  folderDetails: any[];
  selectedFolderDetails: any[];
  videoListFromVdocipher: [];
}

const intialState: IntialState = {
  addResourceFolder: {},
  folderDetails: [],
  selectedFolderDetails: [],
  videoListFromVdocipher: [],
};

const resourceSlice = createSlice({
  name: "parent_resource",
  initialState: intialState,
  reducers: {
    AddResourceFolder: (
      state: Draft<IntialState>,
      action: PayloadAction<ResponseData>
    ) => {
      state.addResourceFolder = action.payload;
    },
    GetResourceFolderList: (
      state: Draft<IntialState>,
      action: PayloadAction<[]>
    ) => {
      state.folderDetails = action.payload;
    },
    AddResourceFolderDocuments: (
      state: Draft<IntialState>,
      action: PayloadAction<ResponseData>
    ) => {
      state.addResourceFolder = action.payload;
    },
    GetResourceFolderDetail: (
      state: Draft<IntialState>,
      action: PayloadAction<any[]>
    ) => {
      state.selectedFolderDetails = action.payload;
    },
    GetVideoListFromVdocipher: (
      state: Draft<IntialState>,
      action: PayloadAction<[]>
    ) => {
      state.videoListFromVdocipher = action.payload;
    },
  },
});

export const {
  AddResourceFolder,
  GetResourceFolderList,
  AddResourceFolderDocuments,
  GetResourceFolderDetail,
  GetVideoListFromVdocipher,
} = resourceSlice.actions;

export default resourceSlice.reducer;
