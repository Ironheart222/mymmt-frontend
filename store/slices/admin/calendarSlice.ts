import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AdminProfile, ResponseData, VacationList } from '../../Interface';


interface IntialState {
	addVacationData: ResponseData | {},
	getVacationData?: [VacationList],
}

const intialState: IntialState = {
	addVacationData: {},
};

const calendarSlice = createSlice({
	name: 'calender',
	initialState: intialState,
	reducers: {
        AddVactionData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.addVacationData = action.payload;
		},
		GetVactionData: (
			state: Draft<IntialState>,
			action: PayloadAction<[VacationList]>
		) => {
			state.getVacationData = action.payload;
		},
	}
});


export const {
    AddVactionData,
	GetVactionData
} = calendarSlice.actions;

export default calendarSlice.reducer;