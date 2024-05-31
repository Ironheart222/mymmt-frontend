import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { DiscountCode } from "../../Interface";
import { ResourceDocumentsParam } from "../../Interface";

/* Add Discount Code */
const createAddResouceFolderDocuments = gql`
  mutation addFolderDocuments(
    $file: Upload
    $is_video: Boolean
    $video_data: JSON!
    $folder_id: Float
  ) {
    addFolderDocuments(
      file: $file
      is_video: $is_video
      video_data: $video_data
      folder_id: $folder_id
    ) {
      status
      message
      data
    }
  }
`;

/* Add Discount Code */
const createAddResouceFolder = gql`
  mutation addResourceFolder(
    $id: Float
    $name: String
    $description: String
    $is_active: Boolean
    $is_delete: Boolean
    $parent_id: [Float!]
    $all_parent: Boolean
  ) {
    addResourceFolder(
      id: $id
      name: $name
      description: $description
      is_active: $is_active
      is_delete: $is_delete
      parent_id: $parent_id
      all_parent: $all_parent
    ) {
      status
      message
      data
    }
  }
`;

/* Get resource folder list */
const createGetResourceFolder = gql`
  query {
    getResourceFolderList {
      folder_id
      folder_name
      is_active
      is_delete
      created_date
      updated_date
      folder_description
      parent_id
      all_parent
      document_list {
        document_id
        folder_id
        document_key
        video_data
        is_video
        is_active
        is_delete
        created_date
        updated_date
      }
    }
  }
`;

/** get plan by id */
const getResourceFolderDetail = gql`
  query getResourceFolderDetail($folder_id: Float!) {
    getResourceFolderDetail(folder_id: $folder_id) {
      folder_id
      folder_name
      is_active
      is_delete
      created_date
      updated_date
      document_list {
        document_id
        folder_id
        document_key
        video_data
        is_video
        is_active
        is_delete
        created_date
        updated_date
        document_name
        document_type
      }
      parent_list {
        parent_id
        first_name
        last_name
      }
    }
  }
`;

/** get plan by id */
const getVideoForMapping = gql`
  query getVideoForMapping($stage_no: Float!) {
    getVideoForMapping(stage_no: $stage_no) {
      status
      messagecode
      message
      data
    }
  }
`;

/* delete worksheet */
const deleteFolderDocumentItem = gql`
  query deleteResourceDocument($document_id: Float!) {
    deleteResourceDocument(document_id: $document_id) {
      status
      message
    }
  }
`;

/*add discount mutation */
export const mutateCreateAddResouceFolder = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddResouceFolder,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*get discount list */
export const mutateCreateGetResourceFolderList = (
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetResourceFolder,
    fetchPolicy: "no-cache",
  });
};

/*add discount mutation */
export const mutateCreateAddResouceFolderDocuments = (
  request: ResourceDocumentsParam,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddResouceFolderDocuments,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** get folder details by id  */
export const queryGetResourceFolderDetailByFolderId = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: getResourceFolderDetail,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** get staged video from vdocipher  */
export const queryGetVideoForMapping = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: getVideoForMapping,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*Delete FolderFile Files */
export const mutateFolderDeleteFiles = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: deleteFolderDocumentItem,
    fetchPolicy: "no-cache",
    variables: {
      document_id: request.document_id,
    },
  });
};
