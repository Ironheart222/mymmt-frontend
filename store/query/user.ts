import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import {
  LoginParam,
  RegisterParam,
  TrialRegisterParam,
  ChildParam,
  LinkExpire,
  EmailVerification,
} from "../Interface";

/* Login  */
const createLoginQuery = gql`
  mutation login($email: String!, $password: String!) {
    login(email_id: $email, password: $password) {
      status
      messagecode
      message
      data
    }
  }
`;

/* Register  */
const createRegisterQuery = gql`
  mutation signup(
    $refferral_code: String!
    $setting_password: String!
    $login_password: String!
    $state: String!
    $country: String!
    $country_code: String!
    $email: String!
    $mobile_no: String!
    $first_name: String!
    $last_name: String!
  ) {
    signup(
      refferral_code: $refferral_code
      setting_password: $setting_password
      login_password: $login_password
      state: $state
      country: $country
      country_code: $country_code
      email: $email
      mobile_no: $mobile_no
      first_name: $first_name
      last_name: $last_name
    ) {
      status
      messagecode
      message
      data
    }
  }
`;

/* Trial Register  */
const createTrialRegisterQuery = gql`
  mutation trialSignup(
    $first_name: String!
    $last_name: String!
    $mobile_no: String!
    $email: String!
    $street_1: String!
    $apartment_no: String!
    $country: String!
    $country_code: String!
    $state: String!
    $postal_code: String!
    $plan_id: String!
    $promo_code: String!
    $setting_password: String!
    $login_password: String!
    $card_data: JSON
    $city: String!
    $price: String!
    $payment_gateway_type: String!
  ) {
    trialSignup(
      first_name: $first_name
      last_name: $last_name
      mobile_no: $mobile_no
      email: $email
      street_1: $street_1
      apartment_no: $apartment_no
      country: $country
      country_code: $country_code
      state: $state
      postal_code: $postal_code
      plan_id: $plan_id
      promo_code: $promo_code
      setting_password: $setting_password
      login_password: $login_password
      card_data: $card_data
      city: $city
      price: $price
      payment_gateway_type: $payment_gateway_type
    ) {
      status
      messagecode
      message
      data
    }
  }
`;

/* Resend Verification Link */
const createResendEmailLinkMuatation = gql`
  mutation resendEmail($email: String!) {
    resendEmail(email: $email) {
      status
      message
      data
    }
  }
`;

/* Email Verification  */
const createEmailVerificationQuery = gql`
  mutation emailVerification($token: String!, $is_verify: Boolean!) {
    emailVerification(token: $token, is_verify: $is_verify) {
      status
      message
      data
    }
  }
`;

/* Link Expire  */
const createIsLinkExpiredQuery = gql`
  mutation isLinkExpired($token: String!) {
    isLinkExpired(token: $token) {
      status
      message
      data
    }
  }
`;

/* Update Subscription from signup page */
const updateSubcriptionMuatation = gql`
  mutation updateSubcription($subscriptions_id: String!) {
    updateSubcription(subscriptions_id: $subscriptions_id) {
      status
      message
      data
    }
  }
`;

/*login mutation */
export const mutateCreateLogin = (
  request: LoginParam,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createLoginQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/* resend email mutation */
export const mutateCreateResendEmail = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createResendEmailLinkMuatation,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*register mutation */
export const mutateCreateRegister = (
  request: RegisterParam,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createRegisterQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/* Cancel Membership */
const cancelMembershipMutation = gql`
  mutation unsubscribeStripePlan($parent_id: Float!) {
    unsubscribeStripePlan(parent_id: $parent_id) {
      status
      message
      data
    }
  }
`;

/*Email verification mutation */
export const mutateCreateEmailVerification = (
  request: EmailVerification,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createEmailVerificationQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*Link expired mutation */
export const mutateCreateCheckLinkExpire = (
  request: LinkExpire,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createIsLinkExpiredQuery,
    fetchPolicy: "no-cache",
    variables: {
      token: request,
    },
  });
};

/*register mutation */
export const mutateTrialUserRegister = (
  request: TrialRegisterParam,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createTrialRegisterQuery,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/* Cancel membership */
export const mutateCancelMembership = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: cancelMembershipMutation,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/* Update Subscription From Signup page */
export const mutateUpdateSubcription = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: updateSubcriptionMuatation,
    fetchPolicy: "no-cache",
    variables: request,
  });
};
