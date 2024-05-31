import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { ChildParam } from '../Interface';

interface IntialState {
    childListData? : [ChildParam];
	childData?: ChildParam;
	isListLoading?: boolean;
}

const intialState: IntialState = {};

const childSlice = createSlice({
	name: 'client',
	initialState: intialState,
	reducers: {
        ChildListData: (
			state: Draft<IntialState>,
			action: PayloadAction<[ChildParam]>
		) => {
			state.childListData = action.payload;
		},

		ChildData: (
			state: Draft<IntialState>,
			action: PayloadAction<ChildParam>
		) => {
			state.childData = action.payload;
		},

		setListLoading: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {
			state.isListLoading = action.payload;
		},
	}
});


export const {
    ChildListData,
	ChildData,
	setListLoading
} = childSlice.actions;

export default childSlice.reducer;