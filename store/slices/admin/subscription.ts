import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";

interface IntialState {
  subscriptionList: [];
  subscriptionPlanList: any[];
  subscriptionPlanData: any;
  loading: boolean;
}

const intialState: IntialState = {
  subscriptionList: [],
  subscriptionPlanList: [],
  subscriptionPlanData: {},
  loading: false,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: intialState,
  reducers: {
    GetSubscriptionList: (
      state: Draft<IntialState>,
      action: PayloadAction<[]>
    ) => {
      state.subscriptionList = action.payload;
    },
    GetSubscriptionPlanList: (
      state: Draft<IntialState>,
      action: PayloadAction<[]>
    ) => {
      state.subscriptionPlanList = action.payload;
    },
    GetSubscriptionPlanById: (
      state: Draft<IntialState>,
      action: PayloadAction<any>
    ) => {
      state.subscriptionPlanData = action.payload;
    },
    SetLoading: (state: Draft<IntialState>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  GetSubscriptionList,
  GetSubscriptionPlanList,
  GetSubscriptionPlanById,
  SetLoading,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
