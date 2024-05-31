import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { ResponseData, DiscountCode } from '../../Interface';


interface IntialState {
	addDiscountCode: ResponseData | {},
	discountCodeList: [],
	deleteDiscountCode: ResponseData | {},
}

const intialState: IntialState = {
	addDiscountCode: {},
	discountCodeList: [],
	deleteDiscountCode: {},
};

const discountSlice = createSlice({
	name: 'discount_code',
	initialState: intialState,
	reducers: {
        AddDiscountCode: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.addDiscountCode = action.payload;
		},
		GetDiscountCodeList: (
			state: Draft<IntialState>,
			action: PayloadAction<[]>
		) => {
			state.discountCodeList = action.payload;
		},
		DeleteDiscountCode: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.deleteDiscountCode = action.payload;
		},
	}
});


export const {
    AddDiscountCode,
	GetDiscountCodeList,
	DeleteDiscountCode
} = discountSlice.actions;

export default discountSlice.reducer;