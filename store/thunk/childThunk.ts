import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	queryGetAllChildInfo,
	queryGetSingleChildInfo
} from '../query/child';
import {
	// ChildData,
	ChildData,
    ChildListData,
	setListLoading
} from '../slices/childSlice';
import Router from "next/router";
import {
	notificationFail,
	notificationSuccess
} from '../slices/notificationSlice';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { ThunkParam } from '../Interface';
import { userLogout } from '../../helpers/helper';
import { logout } from '../slices/userSlice';

export const getAllChildInfo = createAsyncThunk(
	'child_list_info',
	async (userClient : ApolloClient<NormalizedCacheObject>, { dispatch }) => {
		await queryGetAllChildInfo(userClient)
		.then((res) => {
			if(res?.data?.getChildList){
				dispatch(ChildListData(res.data.getChildList));
				// dispatch(notificationSuccess(res.data.login.message));
			}
			dispatch(setListLoading(false));
		}).catch((e:any)=>{
			if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
				dispatch(logout());
			}
			dispatch(notificationFail(e.message));
			dispatch(setListLoading(false));
		})
	}
);

export const getSingleChildInfo = createAsyncThunk(
	'child_info',
	async ({_request,userClient}: ThunkParam, { dispatch }) => {
		await queryGetSingleChildInfo(_request,userClient)
		.then((res) => {
			if(res?.data?.getChildInfo){
				dispatch(ChildData(res.data.getChildInfo));
			}
		}).catch((e:any)=>{
			if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
				dispatch(logout());
			}
			dispatch(notificationFail(e.message));
		})
	}
);


