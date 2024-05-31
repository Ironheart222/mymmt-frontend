import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

interface IntialState {
	revenueData: [],
	revenueLoading: boolean,
	memberData: [],
	memberLoading: boolean,
	memberReportData: [],
	revenueReportData: [],
}

const intialState: IntialState = {
	revenueData: [],
	revenueLoading: false,
	memberData: [],
	memberLoading: false,
	memberReportData: [],
	revenueReportData: []
};

const analyticsSlice = createSlice({
	name: 'admin_client',
	initialState: intialState,
	reducers: {
		MemberData: (
			state: Draft<IntialState>,
			action: PayloadAction<[]>
		) => {
			state.memberData = action.payload;
		},
        RevenueData: (
			state: Draft<IntialState>,
			action: PayloadAction<[]>
		) => {
			state.revenueData = action.payload;
		},
		MemberReportData: (
			state: Draft<IntialState>,
			action: PayloadAction<[]>
		) => {
			state.memberReportData = action.payload;
		},
		RevenueReportData: (
			state: Draft<IntialState>,
			action: PayloadAction<[]>
		) => {
			state.revenueReportData = action.payload;
		},
		SetMemberLoading: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {
			state.memberLoading = action.payload;
		},
		SetRevenueLoading: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {
			state.revenueLoading = action.payload;
		}
	}
});


export const {
    RevenueData,
	SetRevenueLoading,
	MemberData,
	SetMemberLoading,
	MemberReportData,
	RevenueReportData
} = analyticsSlice.actions;

export default analyticsSlice.reducer;