import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { CoreConceptCategory, LessonData, ResponseData, VideoData, WorksheetData } from '../../Interface';


interface IntialState {
	addUpdateWorksheet: ResponseData | {},
	worksheetData: [WorksheetData] | [],
	worksheetDataById?: WorksheetData,
	deleteWorksheet: ResponseData | {},
	mappedLessonData?: LessonData[],
	videoMappingData?: [VideoData] | [],
	worksheetMappingData?: [WorksheetData] | [],
	coreConceptCategoryData?: CoreConceptCategory[],
	videoList?: any,
	addUpdateMappedData?: ResponseData | {},
	unMapWorksheetData?: ResponseData | {},
	deleteMapLessonData?: ResponseData,
	updateVideoData?: ResponseData,
	categoryList?: [],
	challengesList?: []
	challengesData?: {}
	addUpdateChallenge: ResponseData | {},
	deleteChallenge: ResponseData | {},
}

const intialState: IntialState = {
	addUpdateWorksheet: {},
	mappedLessonData: [],
	worksheetData: [],
	deleteWorksheet: {},
	unMapWorksheetData: {},
	addUpdateMappedData: {},
	coreConceptCategoryData: [],
	categoryList: [],
	challengesList: [],
	challengesData: {},
	addUpdateChallenge: {},
	deleteChallenge: {},
};

const lessonSlice = createSlice({
	name: 'lesson',
	initialState: intialState,
	reducers: {
		GetVideoFromVdoData: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.videoList = action.payload;
		},
		GetVideoForMappingData: (
			state: Draft<IntialState>,
			action: PayloadAction<[VideoData] | []>
		) => {
			state.videoMappingData = action.payload;
		},
		GetWorksheetForMappingData: (
			state: Draft<IntialState>,
			action: PayloadAction<[WorksheetData] | []>
		) => {
			state.worksheetMappingData = action.payload;
		},
		GetMappedLessonData: (
			state: Draft<IntialState>,
			action: PayloadAction<LessonData[]>
		) => {
			state.mappedLessonData = action.payload;
		},
        AddUpdateWorksheetData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.addUpdateWorksheet = action.payload;
		},
		GetWorksheetData: (
			state: Draft<IntialState>,
			action: PayloadAction<[WorksheetData] | []>
		) => {
			state.worksheetData = action.payload;
		},
		GetWorksheetDataById: (
			state: Draft<IntialState>,
			action: PayloadAction<WorksheetData>
		) => {
			state.worksheetDataById = action.payload;
		},
		DeleteWorksheet: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.deleteWorksheet = action.payload;
		},
		AddUpdateMappedData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData | {}>
		) => {
			state.addUpdateMappedData = action.payload;
		},
		UnMapWorksheetData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData | {}>
		) => {
			state.unMapWorksheetData = action.payload;
		},
		DeleteMapLessonData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.deleteMapLessonData = action.payload;
		},
		UpdateVideoData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.updateVideoData = action.payload
		},
		GetCoreConceptCategoryData: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.coreConceptCategoryData = action.payload
		},
		GetCategoryList: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.categoryList = action.payload
		},
		GetChallengesList: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.challengesList = action.payload
		},
		GetChallengesById: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.challengesData = action.payload
		},
		AddUpdateChallengeData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.addUpdateChallenge = action.payload;
		},
		DeleteChallenge: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.deleteChallenge = action.payload;
		},
	}
});


export const {
	GetVideoFromVdoData,
	GetVideoForMappingData,
	GetWorksheetForMappingData,
	GetMappedLessonData,
    AddUpdateWorksheetData,
    AddUpdateChallengeData,
	GetWorksheetData,
	GetWorksheetDataById,
	DeleteWorksheet,
	DeleteChallenge,
	AddUpdateMappedData,
	UnMapWorksheetData,
	DeleteMapLessonData,
	UpdateVideoData,
	GetCoreConceptCategoryData,
	GetCategoryList,
	GetChallengesList,
	GetChallengesById
} = lessonSlice.actions;

export default lessonSlice.reducer;