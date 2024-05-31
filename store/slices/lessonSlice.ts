import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { LessonData, ResponseData, SidebarData, VaultVideoData, WeeklyLessonData } from '../Interface';

interface IntialState {
    currWeeklessonData?: ResponseData;
	weekWiseLessonData?: ResponseData;
	vdoCipherOtpData?: ResponseData;
	weeklyLessonData?: WeeklyLessonData;
	lessonOTP?: any;
	watchedFlag: boolean;
	addLessonHistoryData?: ResponseData;
	childWeekData?: ResponseData,
	stageLessonData?: ResponseData,
	vaultVideoData: any,
	challengeLink?: any
}

const intialState: IntialState = {
	// weeklyLessonData: [],
	vaultVideoData: {},
	watchedFlag: false,
	lessonOTP: {},
	challengeLink: ""
};

const lessonSlice = createSlice({
	name: 'lesson',
	initialState: intialState,
	reducers: {
        CurrWeekLessonData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.currWeeklessonData = action.payload;
		},
		WeekWiseLessonData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.weekWiseLessonData = action.payload;
		},
		GetVdoCipherOTP: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.vdoCipherOtpData = action.payload;
		},
		GetWeeklyData: (
			state: Draft<IntialState>,
			action: PayloadAction<WeeklyLessonData>
		) => {
			state.weeklyLessonData = action.payload;
		},
		AddLessonHistory: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.addLessonHistoryData = action.payload;
		},
		GetWeekData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.childWeekData = action.payload;
		},
		GetStageLessonData: (
			state: Draft<IntialState>,
			action: PayloadAction<ResponseData>
		) => {
			state.stageLessonData = action.payload;
		},
		GetVaultVideoData: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.vaultVideoData = action.payload;
		},
		GetLessonOTP: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.lessonOTP = action.payload;
		},
		GetLessonWatched: (
			state: Draft<IntialState>,
			action: PayloadAction<boolean>
		) => {			
			state.watchedFlag = action.payload;
		},
		GetChallengeLink: (
			state: Draft<IntialState>,
			action: PayloadAction<any>
		) => {
			state.challengeLink = action.payload;
		},
	}
});


export const {
    CurrWeekLessonData,
	WeekWiseLessonData,
	GetVdoCipherOTP,
	GetWeeklyData,
	AddLessonHistory,
	GetWeekData,
	GetStageLessonData,
	GetVaultVideoData,
	GetLessonOTP,
	GetLessonWatched,
	GetChallengeLink
} = lessonSlice.actions;

export default lessonSlice.reducer;