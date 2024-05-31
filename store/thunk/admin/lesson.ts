import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationFail, notificationSuccess } from '../../slices/notificationSlice';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { mutateCreateAddUpdateWorksheet, mutateCreateDeleteWorksheet, mutateCreateGetMappedLesson, mutateCreateGetWorksheetInfo, mutateCreateGetWorksheetList, mutateCreateGetVideoForMapping, mutateCreateGetworksheetForMapping, mutateCreateGetVideosFromVdo, mutateCreateAddUpdateMappedLesson, mutateCreateUnMapWorksheet, mutateCreateDeleteMapLesson, mutateCreateEditVideoData, mutateCreateGetCategoryForMapping, mutateCreateGetCategoryList, mutateCreateGetChallenges, mutateCreateGetChallengesById, mutateCreateAddUpdateChallenge, mutateCreateDeleteChallenge } from '../../query/admin/lesson';
import { AddUpdateWorksheetData, DeleteWorksheet, GetMappedLessonData, GetWorksheetData, GetWorksheetDataById, GetWorksheetForMappingData, GetVideoForMappingData, GetVideoFromVdoData, DeleteMapLessonData, UpdateVideoData, AddUpdateMappedData, UnMapWorksheetData, GetCoreConceptCategoryData, GetCategoryList, GetChallengesList, GetChallengesById, AddUpdateChallengeData, DeleteChallenge } from '../../slices/admin/lessonSlice';
import { setLoading } from '../../slices/loadingSlice';
import { ModelThunkParam, ThunkParam } from '../../Interface';
import { adminLogout } from '../../slices/admin/adminAuthSlice';
import { logout } from '../../slices/userSlice';

export const addUpdateWorksheet = createAsyncThunk(
	'admin/add_worksheet',
	async ({ _request, adminClient, uploadClient, onClose }: ModelThunkParam, { dispatch }) => {
		await mutateCreateAddUpdateWorksheet(_request, uploadClient)
			.then((res) => {
				if (res?.data?.addUpdateWorksheet?.status === "true") {
					dispatch(getWorksheetList({_request:_request.stage_no,adminClient}));
					dispatch(AddUpdateWorksheetData(res?.data?.addUpdateWorksheet));
					dispatch(notificationSuccess(res.data.addUpdateWorksheet.message));
					onClose();
				}
			}).catch((e: any) => {
				if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
					dispatch(adminLogout());
				}
				dispatch(notificationFail(e.message));
				onClose();
			})
	}
);

export const addUpdateChallenge = createAsyncThunk(
	'admin/add_update_challenge',
	async ({ _request, adminClient, uploadClient, onClose }: ModelThunkParam, { dispatch }) => {
		await mutateCreateAddUpdateChallenge(_request, uploadClient)
			.then((res) => {
				if (res?.data?.addUpdateChallenge?.status === "true") {
					dispatch(getTop20ChallengesList({adminClient, stage_no:_request.stage_no}));
					dispatch(AddUpdateChallengeData(res?.data?.addUpdateWorksheet));
					dispatch(notificationSuccess(res.data.addUpdateChallenge.message));
					onClose();
				}
			}).catch((e: any) => {
				if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
					dispatch(adminLogout());
				}
				dispatch(notificationFail(e.message));
				onClose();
			})
	}
);

export const getWorksheetList = createAsyncThunk(
	'admin/get_worksheet_list',
	async ({_request,adminClient}:any, { dispatch }) => {
		await mutateCreateGetWorksheetList(_request,adminClient)
			.then((res) => {
				if (res?.data?.getWorksheetList) {
					dispatch(GetWorksheetData(res.data.getWorksheetList));
				}
			}).catch((e: any) => {
				console.log(e.message);
				if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
					dispatch(adminLogout());
				}
				dispatch(notificationFail(e.message));
			})
	}
);

export const getWorksheetById = createAsyncThunk(
	'admin/get_worksheet_by_id',
	async ({ worksheetId, adminClient }: any, { dispatch }) => {
		await mutateCreateGetWorksheetInfo(worksheetId, adminClient)
			.then((res) => {
				if (res?.data?.getWorksheetById) {
					dispatch(GetWorksheetDataById(res.data.getWorksheetById));
				}
			}).catch((e: any) => {
				if (e.networkError.result.errors[0].extensions.code == "UNAUTHENTICATED") {
					dispatch(adminLogout());
				}
				dispatch(notificationFail(e.message));
			})
	}
);

export const deleteWorksheet = createAsyncThunk(
	'admin/delete_worksheet',
	async ({ _request, adminClient, result }: any, { dispatch }) => {
		await mutateCreateDeleteWorksheet(_request, adminClient)
			.then((res) => {
				if (res?.data?.deleteWorksheet?.status == "true") {
					// dispatch(setLoading(false));
					result({status: "true", message: res?.data?.deleteWorksheet.message})
					dispatch(DeleteWorksheet(res.data.deleteWorksheet));
					dispatch(notificationSuccess(res.data.deleteWorksheet.message))
					dispatch(getWorksheetList({_request:_request.stage_no,adminClient}));
				}
			}).catch((e: any) => {
				console.log(e.message);
				result({status: "false", message: ""})
				dispatch(notificationFail(e.message));
			})
	}
);

export const deleteChallenge = createAsyncThunk(
	'admin/delete_challenge',
	async ({ _request, adminClient, result }: any, { dispatch }) => {
		await mutateCreateDeleteChallenge(_request, adminClient)
			.then((res) => {
				if (res?.data?.deleteChallenge?.status == "true") {
					// dispatch(setLoading(false));
					result({status: "true", message: res?.data?.deleteChallenge.message})
					dispatch(DeleteChallenge(res.data.deleteChallenge));
					dispatch(notificationSuccess(res.data.deleteChallenge.message))
					dispatch(getTop20ChallengesList({adminClient, stage_no:_request.stage_no}));
				}
			}).catch((e: any) => {
				console.log(e.message);
				result({status: "false", message: ""})
				dispatch(notificationFail(e.message));
			})
	}
);

export const getVideosFromVdoCipher = createAsyncThunk(
	'admin/get_video_list',
	async ({_request,adminClient}: any, { dispatch }) => {
		await mutateCreateGetVideosFromVdo(_request,adminClient)
			.then((res) => {
				if (res?.data?.getVideoFromVdo?.status == "true") {
					dispatch(GetVideoFromVdoData(res.data.getVideoFromVdo.data));
				}
			}).catch((e: any) => {
				console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
);

export const getVideoForMapping = createAsyncThunk(
	'admin/get_video_list',
	async ({_request,adminClient}: any, { dispatch }) => {
		await mutateCreateGetVideoForMapping(_request,adminClient)
			.then((res) => {
				if (res?.data?.getVideoForMapping?.status == "true") {
					dispatch(GetVideoForMappingData(res.data.getVideoForMapping.data));
				}
			}).catch((e: any) => {
				console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
);

export const getWorksheetForMapping = createAsyncThunk(
	'admin/get_worksheet_list',
	async ({_request,adminClient}: any, { dispatch }) => {
		await mutateCreateGetworksheetForMapping(_request,adminClient).then((res) => {
			if (res?.data?.getWorksheetForMapping) {
				dispatch(GetWorksheetForMappingData(res.data.getWorksheetForMapping));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getCategoryForMapping = createAsyncThunk(
	'admin/get_category_list_for_mapping',
	async ({ userClient }: any, { dispatch }) => {
		await mutateCreateGetCategoryForMapping(userClient).then((res) => {
			if (res?.data?.getCoreConceptCategoryList) {
				dispatch(GetCoreConceptCategoryData(res.data.getCoreConceptCategoryList));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getCategoryList = createAsyncThunk(
	'admin/get_category_list',
	async ({adminClient}: any, { dispatch }) => {
		await mutateCreateGetCategoryList(adminClient).then((res) => {
			if (res?.data?.getCoreConceptCategoryList) {
				dispatch(GetCategoryList(res.data.getCoreConceptCategoryList));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getTop20ChallengesList = createAsyncThunk(
	'admin/get_top_20_challenges',
	async ({adminClient, stage_no}: any, { dispatch }) => {
		await mutateCreateGetChallenges(adminClient, stage_no).then((res) => {
			if (res?.data?.getChallengeList) {
				dispatch(GetChallengesList(res.data.getChallengeList));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getChallegesById = createAsyncThunk(
	'admin/get_top_20_challenges',
	async ({ challegeId, adminClient }: any, { dispatch }) => {
		await mutateCreateGetChallengesById(adminClient, challegeId).then((res) => {
			if (res?.data?.getChallengeList) {
				dispatch(GetChallengesById(res.data.getChallengeList));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const getMappedLesson = createAsyncThunk(
	'admin/get_worksheet_list',
	async ({_request,adminClient}:any,{ dispatch }) => {
		await mutateCreateGetMappedLesson(_request,adminClient)
		.then((res) => {
			if (res?.data?.getMappedLesson) {
				dispatch(GetMappedLessonData(res.data.getMappedLesson));
			}
		}).catch((e: any) => {
			console.log(e.message);
			dispatch(notificationFail(e.message));
		})
	}
);

export const addUpdateMappedLesson = createAsyncThunk(
	'admin/add_update_mapped',
	async ({ _request, adminClient }: any, { dispatch }) => {
		await mutateCreateAddUpdateMappedLesson(_request, adminClient)
			.then((res) => {
				if (res?.data?.addUpdateLessonData?.status === "true") {
					dispatch(AddUpdateMappedData(res?.data?.addUpdateLessonData));
					dispatch(getMappedLesson({_request: _request.stage_no,adminClient}));
					dispatch(GetVideoForMappingData([]));
					dispatch(getVideoForMapping({_request: _request.stage_no,adminClient}));
					dispatch(getWorksheetForMapping(adminClient));
					dispatch(notificationSuccess(res.data.addUpdateLessonData.message));
				}
			}).catch((e: any) => {
				console.log(e.message);
				dispatch(notificationFail(e.message));
				close();
			})
	}
);

export const unMapWorksheet = createAsyncThunk(
	'admin/unmap_worksheet',
	async ({ _request, adminClient }: any, { dispatch }) => {
		await mutateCreateUnMapWorksheet(_request, adminClient)
			.then((res) => {
				if (res?.data?.unMapWorksheet?.status === "true") {
					dispatch(notificationSuccess(res.data.unMapWorksheet.message));
					dispatch(UnMapWorksheetData(res?.data?.unMapWorksheet));
					dispatch(getMappedLesson({_request:_request.stage_no,adminClient}));
					dispatch(GetVideoForMappingData([]));
					dispatch(getVideoForMapping(adminClient));
					dispatch(getWorksheetForMapping(adminClient));
				}
			}).catch((e: any) => {
				console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
);

export const deleteMapLesson = createAsyncThunk(
	'admin/delete_lesson',
	async ({ _request, adminClient, result }: any, { dispatch }) => {
		await mutateCreateDeleteMapLesson(_request, adminClient)
			.then((res) => {
				if (res?.data?.deleteMappedLesson?.status === "true") {
					dispatch(notificationSuccess(res.data.deleteMappedLesson.message));
					dispatch(DeleteMapLessonData(res.data.deleteMappedLesson));
					dispatch(getMappedLesson({_request: _request.stage_no,adminClient}));
					// dispatch(setLoading(false));
					result({status: "true", message: res.data.deleteMappedLesson.message})
				}
			}).catch((e: any) => {
				// dispatch(setLoading(false));
				result({status: "false", message: ""})
				console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
);

export const editVideoData = createAsyncThunk(
	'admin/update_video',
	async ({ _request, adminClient }: any, { dispatch }) => {
		await mutateCreateEditVideoData(_request, adminClient)
			.then((res) => {
				if (res?.data?.updateVideoData?.status === "true") {
					dispatch(UpdateVideoData(res.data.updateVideoData));
					let _req = {
						stage_no: _request.stage,
						page_no: _request.page_no
					  }
					dispatch(getVideosFromVdoCipher({_request: _req,adminClient}));
					dispatch(notificationSuccess(res.data.updateVideoData.message));
				}
			}).catch((e: any) => {
				console.log(e.message);
				dispatch(notificationFail(e.message));
			})
	}
)