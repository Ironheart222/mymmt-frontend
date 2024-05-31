import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import Router from 'next/router';
import { ThunkParam, VideoData } from '../Interface';
import { mutateCreateAddLessonHistoryData, mutateCreateGetChallengeLink, mutateCreateGetCurrWeekLesson, mutateCreateGetLessonOTP, mutateCreateGetStageLesson, mutateCreateGetVaultVideoList, mutateCreateGetVdoCipherOTP, mutateCreateGetWeekData, mutateCreateGetWeeklyLessonData, mutateCreateGetWeekWiseLesson } from '../query/lesson';
import { AddLessonHistory, CurrWeekLessonData, GetLessonOTP, GetLessonWatched, GetStageLessonData, GetVaultVideoData, GetVdoCipherOTP, GetWeekData, GetWeeklyData, WeekWiseLessonData, GetChallengeLink } from '../slices/lessonSlice';
import { notificationFail } from '../slices/notificationSlice';
import { logout } from '../slices/userSlice';

export const getCurrWeekLesson = createAsyncThunk(
	'curr_week_lesson',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetCurrWeekLesson(_request, userClient)
			.then((res) => {
				if (res?.data?.getCurrentWeekLesson?.status === "true") {
					dispatch(CurrWeekLessonData(res.data.getCurrentWeekLesson));
					// dispatch(notificationSuccess(res.data.login.message));
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			})
	}
);

export const getWeekWiseLesson = createAsyncThunk(
	'week_wise_lesson',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetWeekWiseLesson(_request, userClient)
			.then((res) => {
				if (res?.data?.getWeekWiseLesson?.status === "true") {
					dispatch(WeekWiseLessonData(res.data.getWeekWiseLesson));
					// dispatch(notificationSuccess(res.data.login.message));
				}
			}).catch((e: any) => {
				// console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
);

// export const getVdoCipherOTP = createAsyncThunk(
// 	'vdo_cipher/otp_gen',
// 	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
// 		await mutateCreateGetVdoCipherOTP(_request, userClient)
// 			.then((res) => {
// 				if (res?.data?.getWeeklyLesson?.status === "true") {
// 					dispatch(GetVdoCipherOTP(res?.data?.getWeeklyLesson.data));
// 				}
// 			}).catch((e: any) => {
// 				dispatch(notificationFail(e.message));
// 			});
// 	}
// )

export const getWeeklyLessonData = createAsyncThunk(
	'weekly/lesson',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetWeeklyLessonData(_request, userClient)
			.then((res) => {
				if (res?.data?.getWeeklyLesson?.status === "true") {
					dispatch(GetWeeklyData(res?.data?.getWeeklyLesson.data));
				}
			}).catch((e: any) => {
				dispatch(GetWeeklyData({
					week_no: 0,
					lesson: []
				}));
				dispatch(notificationFail(e.message));
			});
	}
)

export const addLessonHistoryData = createAsyncThunk(
	'lesson/history',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateAddLessonHistoryData(_request, userClient)
			.then((res) => {
				if (res?.data?.addLessonHistory?.status === "true") {
					let _req = {
						child_id: +_request.child_id,
						lesson_id: _request.lesson_id
					}
					
					dispatch(GetLessonWatched(true))
					// dispatch(getLessonOTP({ _request: _req, userClient }))
					dispatch(getWeekWiseLesson({ _request: _request.child_id, userClient }));
					dispatch(AddLessonHistory(res?.data?.addLessonHistory));
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			});
	}
)

export const getChildWeekData = createAsyncThunk(
	'lesson/week_data',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetWeekData(_request, userClient)
			.then((res) => {
				if (res?.data?.getChildWeek?.status === "true") {
					dispatch(GetWeekData(res?.data?.getChildWeek))
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			});
	}
)

export const getStageLessonData = createAsyncThunk(
	'lesson/stage_lesson_data',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetStageLesson(_request, userClient)
			.then((res) => {
				if (res?.data?.getStageLesson?.status === "true") {
					dispatch(GetStageLessonData(res?.data?.getStageLesson))
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			});
	}
)

export const getVaultVideoData = createAsyncThunk(
	'lesson/vault_video',
	async ({_request, userClient,result}: any, { dispatch }) => {
		await mutateCreateGetVaultVideoList(_request, userClient)
			.then((res) => {
				if (res?.data?.getLessonVaultList?.status === "true") {				
					dispatch(GetVaultVideoData(res?.data?.getLessonVaultList.data))
					result({status: "true",message:res?.data?.getLessonVaultList?.message})
				}
			}).catch((e: any) => {
				result({status: "false",message:""});
				dispatch(notificationFail(e.message));
			});
	}
)

export const getLessonOTP = createAsyncThunk(
	'lesson_otp',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetLessonOTP(_request, userClient)
			.then((res) => {
				if (res?.data?.getLessonOtp?.status === "true") {
					if (res?.data?.getLessonOtp.data?.history_detail?.length > 0) {
						dispatch(GetLessonWatched(true))
					} else {
						dispatch(GetLessonWatched(false))
					}
					dispatch(GetLessonOTP(res?.data?.getLessonOtp.data));
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			});
	}
)

export const getChallengeLink = createAsyncThunk(
	'get_challenge_link',
	async ({ _request, userClient }: ThunkParam, { dispatch }) => {
		await mutateCreateGetChallengeLink(_request, userClient)
			.then((res) => {
				if (res?.data?.getChallengeLink) {
					dispatch(GetChallengeLink(res?.data?.getChallengeLink));
				}
			}).catch((e: any) => {
				dispatch(notificationFail(e.message));
			});
	}
)