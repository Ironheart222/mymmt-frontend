import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { userClient } from "../apolloClient";
import {
  ChildParam,
  ForgotPassword,
  ParentParam,
  ParentSetting,
  ResetPassword,
} from "../Interface";

/* Parent-Setting Auth  */
const createParentAuthQuery = gql`
  mutation parentSettingAuth($password: String!) {
    parentSettingAuth(password: $password) {
      status
      messagecode
      message
      data
    }
  }
`;

/* child register */
const createAddUpdateChild = gql`
  mutation addUpdateChild(
    $child_id: String
    $child_name: String!
    $school_name: String!
    $gender: String!
    $class_no: String
    $stage_no: Float
    $birth_date: String!
    $video_allowed_count: Float
    $keep_holidays: Boolean!
    $file: Upload
  ) {
    addUpdateChild(
      child_id: $child_id
      child_name: $child_name
      school_name: $school_name
      gender: $gender
      dob: $birth_date
      video_allowed_count: $video_allowed_count
      class_no: $class_no
      stage: $stage_no
      keep_holidays: $keep_holidays
      file: $file
    ) {
      status
      messagecode
      message
      data
    }
  }
`;

/* Get Parent Detail */
const createGetParentDetail = gql`
  query getParentById($parent_id: String) {
    getParentById(parent_id: $parent_id) {
      parent_id
      first_name
      last_name
      mobile_no
      country_code
      email
      street_1
      street_2
      apartment_no
      suburb
      country
      state
      postal_code
      is_active
      is_delete
      is_varified
      product
      subscription_detail {
        sub_master_id
        parent_id
        stripe_customer_id
        plan_id
        subscription_id
        discount_id
        invoice_id
        quantity
        created_date
        updated_date
      }
    }
  }
`;

/* edit Parent Detail */
const createEditParentProfile = gql`
  mutation editParentProfile(
    $parent_id: String!
    $first_name: String!
    $last_name: String!
    $email: String!
    $mobile_no: String!
    $street_1: String
    $street_2: String
    $apartment_no: String
    $suburb: String
    $state: String!
    $country: String!
    $country_code: String!
    $postal_code: String
  ) {
    editParentProfile(
      parent_id: $parent_id
      first_name: $first_name
      last_name: $last_name
      mobile_no: $mobile_no
      email: $email
      state: $state
      country: $country
      country_code: $country_code
      street_1: $street_1
      street_2: $street_2
      apartment_no: $apartment_no
      suburb: $suburb
      postal_code: $postal_code
    ) {
      status
      message
      data
    }
  }
`;

/* parent forgot password */
const createForgotPasswordQuery = gql`
  mutation forgotPassword($email: String!, $password_type: String!) {
    forgotPassword(email_id: $email, password_type: $password_type) {
      status
      message
      data
    }
  }
`;

/* parent reset password */
const createResetPasswordQuery = gql`
  mutation resetPassword($password: String!, $token: String!) {
    resetPassword(password: $password, token: $token) {
      status
      message
      data
    }
  }
`;

/* parent affiliate detail */
const createGetAffiliateData = gql`
  query {
    getAffiliateDetail {
      status
      message
      data
    }
  }
`;

/* send invitation email */
const createSentInvitationLink = gql`
  mutation sendInvitationLink($email: String!) {
    sendInvitationLink(email: $email) {
      status
      message
      data
    }
  }
`;

/* parent email update */
const createUpdateParentEmail = gql`
  mutation editParentEmail($token: String!, $is_verify: Boolean!) {
    editParentEmail(token: $token, is_verify: $is_verify) {
      status
      message
      data
    }
  }
`;

/** send verification link new email */
const createSendLinkToNewEmail = gql`
  mutation resendNewEmail($new_email: String!, $parent_id: String!) {
    resendNewEmail(new_email: $new_email, parent_id: $parent_id) {
      status
      message
      data
    }
  }
`;

/* update both password in parent portal */
const createUpdatePassword = gql`
  mutation updatePassword(
    $current_parent_password: String!
    $new_parent_password: String!
    $new_login_password: String!
  ) {
    updatePassword(
      current_parent_password: $current_parent_password
      new_parent_password: $new_parent_password
      new_login_password: $new_login_password
    ) {
      status
      message
      data
    }
  }
`;

/* Get Subscription Detail */
const getSubscriptionDetailsData = gql`
  query getSubscriptionDetails($subscription_id: String!) {
    getSubscriptionDetails(subscription_id: $subscription_id) {
      status
      message
    }
  }
`;

/*add child mutation */
export const mutateCreateAddUpdateChild = (
  request: Partial<ChildParam>,
  userUploadClient: ApolloClient<NormalizedCacheObject>
) => {
  return userUploadClient.mutate({
    mutation: createAddUpdateChild,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*add child mutation */
export const mutateCreateParentAuth = (
  request: ParentSetting,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createParentAuthQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*forgot password mutation */
export const mutateForgotPassword = (
  request: ForgotPassword,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createForgotPasswordQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*reset password mutation */
export const mutateResetPassword = (
  request: ResetPassword,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createResetPasswordQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*get parent data by id */
export const mutateCreateGetParentById = (
  request: string,
  client: ApolloClient<NormalizedCacheObject>
) => {
  return client.query({
    query: createGetParentDetail,
    fetchPolicy: "no-cache",
    variables: {
      parent_id: request,
    },
  });
};

/* edit profile mutation */
export const mutateCreateEditProfile = (
  request: Partial<ParentParam>,
  client: ApolloClient<NormalizedCacheObject>
) => {
  return client.mutate({
    mutation: createEditParentProfile,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*get affiliate detail */
export const mutateCreateGetAffiliateDetails = (
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.query({
    query: createGetAffiliateData,
    fetchPolicy: "no-cache",
  });
};

/*sent invitation link */
export const mutateCreateSentInvitationLink = (
  request: { email: string },
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createSentInvitationLink,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** update parent email */
export const mutateCreateUpdateParentEmail = (
  request: { email: string; is_verify: boolean },
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createUpdateParentEmail,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** send link to new email */
export const mutateCreateSendLinkToNewEmail = (
  request: { new_email: string },
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createSendLinkToNewEmail,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** update password */
export const mutateCreateUpdatePassword = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createUpdatePassword,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*get subscription detail */
export const mutateGetSubscriptionDetails = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.query({
    query: getSubscriptionDetailsData,
    fetchPolicy: "no-cache",
    variables: request,
  });
};
