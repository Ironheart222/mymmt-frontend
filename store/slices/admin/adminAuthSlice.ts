import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AdminProfile, ResponseData } from '../../Interface';


interface IntialState {
	adminLoginData: ResponseData | {},
	parentListData: [],
	updateParentStatus: ResponseData | {},
	adminEditData: ResponseData | {},
	adminProfileData?: AdminProfile,
	updateAdminData?: ResponseData | {}
}

const intialState: IntialState = {
	adminLoginData: {},
	parentListData: [],
	updateParentStatus: {},
	adminEditData: {},
	updateAdminData: {}
};

const adminAuthSlice = createSlice({
	name: 'admin_client',
	initialState: intialState,
	reducers: {
        AdminAuthData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.adminLoginData = action.payload;
		},

		ParentListData: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.parentListData = action.payload;
		},

		UpdateParentStatus: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.updateParentStatus = action.payload;
		},

		AdminEditData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.adminEditData = action.payload;
		},
		
		AdminProfileData: (
			state: Draft<IntialState>,
			action: PayloadAction<AdminProfile>
		) => {
			state.adminProfileData = action.payload;			
		},

		UpdateAdminData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.updateAdminData = action.payload;			
		},

		adminLogout: state => {
			localStorage.removeItem("admin_token");
		}
	}
});


export const {
    AdminAuthData,
	ParentListData,
	UpdateParentStatus,
	AdminEditData,
	AdminProfileData,
	UpdateAdminData,
	adminLogout
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;