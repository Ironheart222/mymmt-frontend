import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { userClient } from "../apolloClient";


interface RequestType {
    week_no?: number,
    child_id?: string,
    lesson_id?: string,
    stage_no?:string
}

/* Get Current Week Lesson List */
const createGetCurrWeekLesson = gql`
    query getCurrentWeekLesson($child_id: String!){
        getCurrentWeekLesson(child_id:$child_id){
            status
            message
            data
        }
    }
`

/* Get Week Wise Lesson List */
const createGetWeekWiseLesson = gql`
    query getWeekWiseLesson($child_id: String!){
        getWeekWiseLesson(child_id:$child_id){
            status
            message
            data
        }
    }
`

/* generate vdo cipher video OTP */
const getVdoCipherOTP = gql`
    mutation getVdoCipherOtp($videoId: String!){
        getVdoCipherOtp(video_id:$videoId){
            status
            message
            data
        }
    }
`
/* get Weekly Lesson data with otp & playback */
const getWeeklyLessonData = gql`
    query getWeeklyLesson(
            $week_no: Float!
            $child_id: String!
        ){
        getWeeklyLesson(
            week_no:$week_no,
            child_id: $child_id
        ){
            status
            message
            data
        }
    }
`

/* add lesson history */
const addLessonHistory = gql`
    mutation addLessonHistory(
        $child_id: String!
        $lesson_id: Float!
    ){
        addLessonHistory(
            child_id: $child_id,
            lesson_id: $lesson_id,
        ){
            status
            data
            message
        }
    }
`

/* get Week Data */
const getWeekData = gql`
    query getChildWeek(
        $child_id: String!
    ){
        getChildWeek(
            child_id: $child_id,
        ){
            status
            data
            message
        }
    }
`

/* get stage wise data */
const getStageLessonData = gql`
    query getStageLesson($stage_no: String!,$child_id: String!){
        getStageLesson(stage_no: $stage_no,child_id: $child_id){
            status
            message
            data
        }
    }
`

/* get vault video list */
const getVaultVideoData = gql`
    query getLessonVaultList($stage_no: Float!, $category_id: Float, $page_no: Float){
        getLessonVaultList(stage_no: $stage_no, category_id: $category_id, page_no: $page_no){
            status
            message
            data
        }
    }
  `

/* get single lesson OTP */
const getLessonOTP = gql`
    query getLessonOtp($child_id: Float!,$lesson_id: Float!){
        getLessonOtp(child_id: $child_id,lesson_id: $lesson_id){
            status
            message
            data
        }
    }
  `
  
/* get Challenge Link */
const getChallengeLink = gql`
    query getChallengeLink($challenge_pdf_key: String){
        getChallengeLink(challenge_pdf_key: $challenge_pdf_key)
    }
  `

export const mutateCreateGetCurrWeekLesson = (request: number,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: createGetCurrWeekLesson,
        fetchPolicy: 'no-cache',
        variables: {
            child_id: request 
        }
    });
}

export const mutateCreateGetWeekWiseLesson = (request: number,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: createGetWeekWiseLesson,
        fetchPolicy: 'no-cache',
        variables: {
            child_id: request 
        }
    });
}

export const mutateCreateGetVdoCipherOTP = (request: string,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.mutate({
        mutation: getVdoCipherOTP,
        fetchPolicy: 'no-cache',
        variables: {
            videoId: request 
        }
    });
}

export const mutateCreateGetWeeklyLessonData = (request: RequestType,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: getWeeklyLessonData,
        fetchPolicy: 'no-cache',
        variables: request
    });
}

export const mutateCreateAddLessonHistoryData = (request: RequestType,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.mutate({
        mutation: addLessonHistory,
        fetchPolicy: 'no-cache',
        variables: request
    });
}

export const mutateCreateGetWeekData = (request: RequestType,userClient: ApolloClient<NormalizedCacheObject>) => {
    
    return userClient.query({
        query: getWeekData,
        fetchPolicy: 'no-cache',
        variables: {
            child_id: request
        }
    });
}

export const mutateCreateGetStageLesson = (request: RequestType,userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: getStageLessonData,
        fetchPolicy: 'no-cache',
        variables: request
    });
}

export const mutateCreateGetVaultVideoList = (request: any, userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: getVaultVideoData,
        fetchPolicy: 'no-cache',
        variables: request
    });
}

export const mutateCreateGetLessonOTP = (request: any, userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: getLessonOTP,
        fetchPolicy: 'no-cache',
        variables: request
    });
}

export const mutateCreateGetChallengeLink = (request: any, userClient: ApolloClient<NormalizedCacheObject>) => {
    return userClient.query({
        query: getChallengeLink,
        fetchPolicy: 'no-cache',
        variables: {
            challenge_pdf_key: request.challenge_file_key
        }
    });
}