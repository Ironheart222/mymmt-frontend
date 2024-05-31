import { createAsyncThunk } from '@reduxjs/toolkit';
import Router from "next/router";
import { notificationFail, notificationSuccess } from '../../slices/notificationSlice';
import { mutateCreateAddVacation,mutateCreateGetVacationList } from '../../query/admin/calendar';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { GetVactionData } from '../../slices/admin/calendarSlice';
import { adminLogout } from '../../slices/admin/adminAuthSlice';
import { ThunkParam } from '../../Interface';

export const addVactionInfo = createAsyncThunk(
	'admin/add_vaction',
	async ({_request,adminClient} :any, { dispatch }) => {
		await mutateCreateAddVacation(_request,adminClient)
		.then((res) => {
			if(res?.data?.addVacationInfo?.status === "true"){
				// dispatch(AdminAuthData(res.data.addVacationInfo));
				dispatch(getVactionList({_request: _request.selectedCountry,adminClient}));
				dispatch(notificationSuccess(res.data.addVacationInfo.message));
			}
		}).catch((e:any)=>{
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getVactionList = createAsyncThunk(
	'admin/get_vacation_list',
	async ({_request,adminClient}: any, { dispatch }) => {
		await mutateCreateGetVacationList(_request,adminClient)
		.then((res) => {
			if(res?.data?.getVacationList){
				dispatch(GetVactionData(res.data.getVacationList));
			}
		}).catch((e:any)=>{
			dispatch(notificationFail(e.message));
		})
	}
);