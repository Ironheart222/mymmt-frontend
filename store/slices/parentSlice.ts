import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AffiliateDataType, ParentParam, ResponseData } from '../Interface';


const resetAffiliateData = {
	referral_point: 0,
    referral_link: ''
}

interface IntialState {
	parentAuthData: ResponseData | {};
	childData: ResponseData | {};
	forgotPasswordData: ResponseData | {};
	resetPasswordData: ResponseData | {};
	editParentProfile: ResponseData | {};
	parentProfileData?: ParentParam;
	affiliateData: AffiliateDataType
}

const intialState: IntialState = {
	parentAuthData: {},
	childData: {},
	forgotPasswordData: {},
	resetPasswordData: {},
	editParentProfile: {},
	affiliateData: resetAffiliateData
};

const parentSlice = createSlice({
	name: 'client',
	initialState: intialState,
	reducers: {
        ParentAuthData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData | {}>
		) => {
			state.parentAuthData = action.payload;
		},

		ChildData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.childData = action.payload;
		},

		ForgotPasswordData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.forgotPasswordData = action.payload;
		},

		ResetPasswordData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.resetPasswordData = action.payload;
		},

		EditParentProfile: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.editParentProfile = action.payload;
		},

		ParentProfileData: (
			state: Draft<IntialState>,
			action: PayloadAction<ParentParam>
		) => {
			state.parentProfileData = action.payload;
		},
		
		AffiliateData: (
			state: Draft<IntialState>,
			action: PayloadAction<AffiliateDataType>
		) => {
			state.affiliateData = action.payload;
		}
	}
});


export const {
    ParentAuthData,
	ChildData,
	ForgotPasswordData,			
	ResetPasswordData,
	EditParentProfile,
	ParentProfileData,
	AffiliateData
} = parentSlice.actions;

export default parentSlice.reducer;