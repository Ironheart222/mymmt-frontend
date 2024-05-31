import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { request } from "http";
import { adminClient } from "../../apolloClient";
import {
  LessonData,
  MappedData,
  VideoParam,
  WorksheetParam,
} from "../../Interface";

/* Get worksheet List */
const createGetWorksheetList = gql`
  query getWorksheetList($stage_no: Float!) {
    getWorksheetList(stage_no: $stage_no) {
      worksheet_id
      worksheet_name
      worksheet_description
      worksheet_url
      is_delete
      created_date
      updated_date
    }
  }
`;

/* Get worksheet Info */
const createGetWorksheetInfo = gql`
  query getWorksheetById($worksheet_id: Float!) {
    getWorksheetById(worksheet_id: $worksheet_id) {
      worksheet_id
      worksheet_name
      worksheet_description
      worksheet_url
      stage_no
      is_delete
      created_date
      updated_date
    }
  }
`;

/* add worksheet */
const createAddUpdateWorksheet = gql`
  mutation addUpdateWorksheet(
    $worksheet_id: String
    $title: String!
    $description: String
    $file: Upload
    $fileURL: String
    $stage_no: Float!
  ) {
    addUpdateWorksheet(
      worksheet_id: $worksheet_id
      title: $title
      description: $description
      file: $file
      file_url: $fileURL
      stage_no: $stage_no
    ) {
      status
      message
      data
    }
  }
`;

/* add update challenge */
const createAddUpdateChallenge = gql`
  mutation addUpdateChallenge(
    $challenge_id: Float
    $challenge_name: String!
    $challenge_order: Float
    $file: Upload
    $stage_no: Float
  ) {
    addUpdateChallenge(
      challenge_id: $challenge_id
      challenge_name: $challenge_name
      challenge_order: $challenge_order
      file: $file
      stage_no: $stage_no
    ) {
      status
      message
      data
    }
  }
`;

/* delete worksheet */
const createDeleteWorksheet = gql`
  mutation deleteWorksheet($worksheet_id: String!) {
    deleteWorksheet(worksheet_id: $worksheet_id) {
      status
      message
      data
    }
  }
`;

/* delete challenge */
const createDeleteChallenge = gql`
  query deleteChallenge($challenge_id: Float) {
    deleteChallenge(challenge_id: $challenge_id) {
      status
      message
      data
    }
  }
`;

/* Get videos from vdo */
const createGetVideosFromVdo = gql`
  query getVideoFromVdo($stage_no: String!, $page_no: Float!) {
    getVideoFromVdo(stage_no: $stage_no, page_no: $page_no) {
      status
      message
      data
    }
  }
`;

/* Get video for mapping */
const createGetVideoForMapping = gql`
  query getVideoForMapping($stage_no: Float!) {
    getVideoForMapping(stage_no: $stage_no) {
      status
      message
      data
    }
  }
`;

/* Get worksheet for mapping */
const createGetWorksheetForMapping = gql`
  query getWorksheetForMapping($stage_no: Float!) {
    getWorksheetForMapping(stage_no: $stage_no) {
      worksheet_id
      worksheet_name
      worksheet_description
      worksheet_url
      is_delete
      created_date
      updated_date
    }
  }
`;

/* Get Category for mapping */
const createGetCategoryForMapping = gql`
  query getCoreConceptCategoryList {
    getCoreConceptCategoryList {
      category_id
      category_name
      category_tag
      is_active
      is_delete
      lesson_detail {
        lesson_id
        lesson_no
        vdo_cipher_video
        worksheet_id
        stage_no
        category_id
        created_date
        updated_date
      }
    }
  }
`;

/* Get Category List */
const createGetCategoryList = gql`
  query {
    getCoreConceptCategoryList {
      category_id
      category_name
      category_tag
      is_active
      is_delete
      lesson_detail {
        lesson_id
        lesson_no
        vdo_cipher_video
        worksheet_id
        stage_no
        category_id
        created_date
        updated_date
      }
    }
  }
`;

/* Get Top20Challenges List */
const createGetChallenges = gql`
  query getChallengeList($stage_no: Float!) {
    getChallengeList(stage_no: $stage_no) {
      challenge_id
      challenge_name
      challenge_file_key
      challenge_file_name
      challenge_order
      stage_no
      created_date
      updated_date
    }
  }
`;

/* Get Top20Challenges by id */
const createGetChallengesById = gql`
  query getChallengeList($stage_no: Float!) {
    getChallengeList(stage_no: $stage_no) {
      challenge_id
      challenge_name
      challenge_file_key
      challenge_file_name
      challenge_order
      stage_no
      created_date
      updated_date
    }
  }
`;

/* Get mapped video */
const createGetMappedLesson = gql`
  query getMappedLesson($stage_no: Float!) {
    getMappedLesson(stage_no: $stage_no) {
      lesson_id
      lesson_no
      vdo_cipher_video
      worksheet_id
      stage_no
      created_date
      updated_date
      worksheet_detail {
        worksheet_id
        worksheet_name
        worksheet_description
        worksheet_url
        is_delete
        created_date
        updated_date
      }
      category_detail {
        category_id
        category_name
        category_tag
        is_active
        is_delete
      }
    }
  }
`;

/* Add Mapped Lesson */
const createAddUpdateMappedLesson = gql`
  mutation addUpdateLessonData(
    $lesson_id: String
    $lesson_no: Float!
    $video_data: JSON!
    $worksheet_id: Float!
    $stage_no: Float!
    $category_id: Float
  ) {
    addUpdateLessonData(
      lesson_id: $lesson_id
      lesson_no: $lesson_no
      video_data: $video_data
      worksheet_id: $worksheet_id
      stage_no: $stage_no
      category_id: $category_id
    ) {
      status
      message
      data
    }
  }
`;

/* Unmapped worksheet */
const createUnMapWorksheet = gql`
  mutation unMapWorksheet($lesson_id: String!) {
    unMapWorksheet(lesson_id: $lesson_id) {
      status
      message
      data
    }
  }
`;

/* update delete map worksheet */
const deleteMapWorksheet = gql`
  mutation deleteMappedLesson($lesson_id: String!) {
    deleteMappedLesson(lesson_id: $lesson_id) {
      status
      message
      data
    }
  }
`;

/* edit video */
const createEditVideoData = gql`
  mutation updateVideoData(
    $video_id: String!
    $title: String!
    $description: String
  ) {
    updateVideoData(
      video_id: $video_id
      title: $title
      description: $description
    ) {
      status
      message
      data
    }
  }
`;

/*get worksheet list */
export const mutateCreateGetWorksheetList = (
  request: number,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetWorksheetList,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: request,
    },
  });
};

/*get worksheet list */
export const mutateCreateGetWorksheetInfo = (
  worksheetId: string,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetWorksheetInfo,
    fetchPolicy: "no-cache",
    variables: {
      worksheet_id: worksheetId,
    },
  });
};

/*add worksheet mutation */
export const mutateCreateAddUpdateWorksheet = (
  request: WorksheetParam,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddUpdateWorksheet,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*add update challenge mutation */
export const mutateCreateAddUpdateChallenge = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddUpdateChallenge,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*delete worksheet */
export const mutateCreateDeleteWorksheet = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createDeleteWorksheet,
    fetchPolicy: "no-cache",
    variables: {
      worksheet_id: request.worksheetId,
    },
  });
};

/*delete challenge */
export const mutateCreateDeleteChallenge = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createDeleteChallenge,
    fetchPolicy: "no-cache",
    variables: {
      challenge_id: request.challengeId,
    },
  });
};

/*get video list for mapping */
export const mutateCreateGetVideoForMapping = (
  request: number,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetVideoForMapping,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: request,
    },
  });
};

/*get video list for mapping */
export const mutateCreateGetVideosFromVdo = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetVideosFromVdo,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: request.stage_no,
      page_no: request.page_no,
    },
  });
};

/*get worksheet list for mapping */
export const mutateCreateGetworksheetForMapping = (
  request: number,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetWorksheetForMapping,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: request,
    },
  });
};

/*get category list for mapping */
export const mutateCreateGetCategoryForMapping = (
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetCategoryForMapping,
    fetchPolicy: "no-cache",
  });
};

/* get category list */
export const mutateCreateGetCategoryList = (
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetCategoryList,
    fetchPolicy: "no-cache",
  });
};

/* get category list */
export const mutateCreateGetChallenges = (
  adminClient: ApolloClient<NormalizedCacheObject>,
  stageNo: any
) => {
  return adminClient.query({
    query: createGetChallenges,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: stageNo,
    },
  });
};

/* get category list */
export const mutateCreateGetChallengesById = (
  adminClient: ApolloClient<NormalizedCacheObject>,
  challegeId: any
) => {
  return adminClient.query({
    query: createGetChallengesById,
    fetchPolicy: "no-cache",
    variables: {
      challegeId: challegeId,
    },
  });
};

/*get mapped video list */
export const mutateCreateGetMappedLesson = (
  request: number,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetMappedLesson,
    fetchPolicy: "no-cache",
    variables: {
      stage_no: request,
    },
  });
};

/*add update mapped Lesson mutation */
export const mutateCreateAddUpdateMappedLesson = (
  request: MappedData,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddUpdateMappedLesson,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*unmapped worksheet mutation */
export const mutateCreateUnMapWorksheet = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createUnMapWorksheet,
    fetchPolicy: "no-cache",
    variables: {
      lesson_id: request.lesson_id,
    },
  });
};

/* delete map lesson */
export const mutateCreateDeleteMapLesson = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: deleteMapWorksheet,
    fetchPolicy: "no-cache",
    variables: {
      lesson_id: request.id,
    },
  });
};

/* edit video data */
export const mutateCreateEditVideoData = (
  request: VideoParam,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createEditVideoData,
    fetchPolicy: "no-cache",
    variables: request,
  });
};
