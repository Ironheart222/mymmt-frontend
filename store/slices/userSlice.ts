import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { ResponseData } from '../Interface';

interface IntialState {
	loginData: Array<ResponseData>;
	registerData: Array<ResponseData>;
	linkEpireData?: ResponseData;
	emailVerificationData: ResponseData;
	resendEmailData: ResponseData;
	// ChildData: Array<ResponseData>;
}

const intialState: IntialState = {
	loginData: [],
	registerData: [],
	emailVerificationData: {
		status: "false",
		message: "Loading",
		messagecode: "503",
		data: null
	},
	resendEmailData: {
		status: "false",
		message: "",
		messagecode: "",
		data: null
	}
	// ChildData: []
};

const userSlice = createSlice({
	name: 'client',
	initialState: intialState,
	reducers: {
		LoginData: (
			state: Draft<IntialState>,
			action: PayloadAction<Array<ResponseData>>
		) => {
			state.loginData = action.payload;
		},

		RegisterData: (
			state: Draft<IntialState>,
			action: PayloadAction<Array<ResponseData>>
		) => {
			state.registerData = action.payload;
		},

		ResendEmailData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.resendEmailData = action.payload;
		},

		EmailVerificaionData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.emailVerificationData = action.payload;
		},

		LinkExpireData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.linkEpireData = action.payload;
		},
		logout: state => {
			localStorage.removeItem("user_token");
			localStorage.removeItem("is_child");
			localStorage.removeItem("child_id");
		},
		parentLogout: state => {
			localStorage.removeItem("parent-token");
		}

		// ChildData: (
		// 	state: Draft<IntialState>,
		// 	action: PayloadAction<Array<ResponseData>>
		// ) => {
		// 	state.ChildData = action.payload;
		// },
	}
});


export const {
	LoginData,
	RegisterData,
	ResendEmailData,
	LinkExpireData,
	EmailVerificaionData,
	logout,
	parentLogout
} = userSlice.actions;

export default userSlice.reducer;