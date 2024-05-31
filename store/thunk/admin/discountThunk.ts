import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationFail, notificationSuccess } from '../../slices/notificationSlice';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { mutateCreateAddDiscountCode, mutateCreateDeleteDiscountCode, mutateCreateGetDiscountList } from '../../query/admin/discount';
import { GetDiscountCodeList } from '../../slices/admin/DiscountSlice';
import { adminLogout } from '../../slices/admin/adminAuthSlice';

export const addDiscountCode = createAsyncThunk(
	'admin/add_discount',
	async ({_request,adminClient, result} :any, { dispatch }) => {
		await mutateCreateAddDiscountCode(_request,adminClient)
		.then((res) => {
			if(res?.data?.addDiscountCode?.status === "true"){
				// dispatch(AdminAuthData(res.data.addVacationInfo));
				dispatch(getDiscountCodes(adminClient));
				dispatch(notificationSuccess(res.data.addDiscountCode.message));
				result({status: "true",message: res.data.addDiscountCode.message})
			}
		}).catch((e:any)=>{
			result({status: "false",message: ""})
			dispatch(notificationFail(e.message));
		})
	}
);

export const getDiscountCodes = createAsyncThunk(
	'admin/get_discounts',
	async (adminClient: ApolloClient<NormalizedCacheObject>, { dispatch }) => {
		await mutateCreateGetDiscountList(adminClient).then((res) => {
			if(res?.data?.getDiscountList.status === "true"){
				dispatch(GetDiscountCodeList(res.data.getDiscountList.data));
			}
		}).catch((e:any)=>{
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const deleteDiscountCode = createAsyncThunk(
	'admin/delete_discount',
	async ({_request,adminClient,result} :any, { dispatch }) => {
		await mutateCreateDeleteDiscountCode(_request,adminClient).then((res) => {
			if(res?.data?.deleteDiscountCode?.status === "true"){
				dispatch(getDiscountCodes(adminClient));
				dispatch(notificationSuccess(res?.data?.deleteDiscountCode?.message));
				result({status: "true",message: "deleted successfull."})
			}
		}).catch((e:any)=>{
			console.log(e.message);
			result({status: "false",message: e.message})
			dispatch(notificationFail(e.message));
		})
	}
);