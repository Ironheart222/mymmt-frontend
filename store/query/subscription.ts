import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { userClient } from "../apolloClient";
import {
  ChildParam,
  ForgotPassword,
  ParentParam,
  ParentSetting,
  ResetPassword,
} from "../Interface";

/* update credit card  */
const createUpdateCreditCard = gql`
  mutation updateCreditCard($cardData: JSON!, $payment_method_id: String) {
    updateCreditCard(
      cardData: $cardData
      payment_method_id: $payment_method_id
    ) {
      status
      message
      data
    }
  }
`;

/* getting customer stripe detail */
const createGetStripCustomerDetail = gql`
  mutation {
    getStripeCustomerDetail {
      status
      message
      data
    }
  }
`;
/* detch payment method from customer*/
const createDetchPaymentMethod = gql`
  mutation detachPaymentMethod($payment_method_id: String!) {
    detachPaymentMethod(payment_method_id: $payment_method_id) {
      status
      message
      data
    }
  }
`;
/* create set default card */
const createSetCardAsDefault = gql`
  mutation setCardAsDefault($payment_method_id: String!) {
    setCardAsDefault(payment_method_id: $payment_method_id) {
      status
      message
      data
    }
  }
`;
/** create verify discount code */
const createVerifyDiscountCode = gql`
  mutation verifyDiscountCode($discount_code: String!, $plan_id: String) {
    verifyDiscountCode(discount_code: $discount_code, plan_id: $plan_id) {
      status
      message
      data
    }
  }
`;

/** get upcoming subscription  */
const getUpcomingSubsciptionPlan = gql`
  query getUpcomingSubscription {
    getUpcomingSubscription {
      status
      data
      message
    }
  }
`;
/** create subscription  */
const createSubscriptionPlan = gql`
  mutation upgradeSubscriptionPlan($paymentData: JSON!) {
    upgradeSubscriptionPlan(paymentData: $paymentData) {
      status
      data
      message
    }
  }
`;

/** verify plan purchase or not */
const verifyPurchasePlan = gql`
  mutation {
    verifyPurchasedPlan {
      status
      data
      message
    }
  }
`;

/** cancel subscription  */
const cancelSubscribeStripePlan = gql`
  mutation cancelSubscribeStripePlan(
    $subscription_id: String
    $subscription_type: String
  ) {
    cancelSubscribeStripePlan(
      subscription_id: $subscription_id
      subscription_type: $subscription_type
    ) {
      status
      data
      message
    }
  }
`;

/*update credit card mutation */
export const mutateCreateUpdateCreditCard = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createUpdateCreditCard,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*getting stripe customer detail mutation */
export const mutateCreateGetStripeCustomerDetail = (
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createGetStripCustomerDetail,
    fetchPolicy: "no-cache",
  });
};

/* detch payment method from customer */
export const mutateCreateDetachPaymentMethod = (
  request: string,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createDetchPaymentMethod,
    fetchPolicy: "no-cache",
    variables: {
      payment_method_id: request,
    },
  });
};

/* set payment method as default */
export const mutateCreateSetCardAsDefault = (
  request: string,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createSetCardAsDefault,
    fetchPolicy: "no-cache",
    variables: {
      payment_method_id: request,
    },
  });
};

/** verify discount code */
export const mutateCreateVerifyDiscountCode = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createVerifyDiscountCode,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** get upcoming subscription plan  */
export const mutateGetUpcomingPlan = (
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: getUpcomingSubsciptionPlan,
    fetchPolicy: "no-cache",
  });
};

/** create subscription  */
export const mutateCreateSubscriptionPlan = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: createSubscriptionPlan,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** verify purchase plan  */
export const mutateCreateVerifyPurchasePlan = (
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: verifyPurchasePlan,
    fetchPolicy: "no-cache",
  });
};

/** cancel subscription  */
export const mutateCancelSubscriptionPlan = (
  request: any,
  userClient: ApolloClient<NormalizedCacheObject>
) => {
  return userClient.mutate({
    mutation: cancelSubscribeStripePlan,
    fetchPolicy: "no-cache",
    variables: request,
  });
};
