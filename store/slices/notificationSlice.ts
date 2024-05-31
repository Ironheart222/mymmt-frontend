
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
	message: string;
	status: boolean;
	type: string;
}

const initialState: InitialState = {
	message: "",
	status: false,
	type: ""
};

const notificationSlice = createSlice({
	name: 'notification',
	initialState: initialState,
	reducers: {
		notificationFail: (
			state: Draft<InitialState>,
			action: PayloadAction<string>
		) => {
			state.status = false;
			state.message = action.payload;
		},
		notificationSuccess: (
			state: Draft<InitialState>,
			action: PayloadAction<string>
		) => {
			state.status = true;
			state.message = action.payload;
		},
		notificationClear: (state: Draft<InitialState>) => {
			state.message = "";
			state.status = false;
			state.type = "";
		}
	}
});

export const { notificationFail, notificationSuccess, notificationClear } =
	notificationSlice.actions;

export default notificationSlice.reducer;
