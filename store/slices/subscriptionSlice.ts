import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AffiliateDataType, ParentParam, ResponseData } from '../Interface';

interface IntialState {
	stripeCustomerDetail: {};
	discountDetail: {};
	purchasePlan: ResponseData | {};
	upcomingPlan: any;
	componentLoading: boolean;
	buttonLoading: boolean;
}

const intialState: IntialState = {
	stripeCustomerDetail: {},
	discountDetail: {},
	purchasePlan: {},
	upcomingPlan: {},
	componentLoading: false,
	buttonLoading: false,
};

const subscriptionSlice = createSlice({
	name: 'client',
	initialState: intialState,
	reducers: {
        StripeCustomerDetail: (
			state: Draft<IntialState>,
			action: PayloadAction<{}>
		) => {
			state.stripeCustomerDetail = action.payload;
		},
		SetComponentLoading: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {
			state.componentLoading = action.payload
		},
		SetButtonLoading: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {
			state.buttonLoading = action.payload
		},
		DiscountDetail: (
			state: Draft<IntialState>,
			action: PayloadAction<{}>
		) => {
			state.discountDetail = action.payload;
		},
		PurchasedPlan: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData | {}>
		) => {
			state.purchasePlan = action.payload;
		},
		UpcomingPlan: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData | {}>
		) => {
			state.upcomingPlan = action.payload;
		}
	}
});


export const {
    StripeCustomerDetail,
	SetComponentLoading,
	SetButtonLoading,
	DiscountDetail,
	PurchasedPlan,
	UpcomingPlan
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;