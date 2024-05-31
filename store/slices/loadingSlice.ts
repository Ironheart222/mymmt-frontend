
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

interface InitialState {
	isLoading: boolean;
}

const initialState: InitialState = {
	isLoading: false,
};

const loadingSlice = createSlice({
	name: 'loading',
	initialState: initialState,
	reducers: {
		setLoading: (
			state: Draft<InitialState>,
			action: PayloadAction<boolean>
		) => {
			state.isLoading = action.payload;
		},
	}
});

export const { setLoading } =
loadingSlice.actions;

export default loadingSlice.reducer;
