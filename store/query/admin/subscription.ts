import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";

/** get subscription list */
const createGetSubscriptionList = gql`
  mutation {
    getSubscriptionList {
      status
      message
      data
    }
  }
`;

/** get subsction plan list  */
const createGetSubscriptionPlanList = gql`
  query {
    getSubscriptionPlanList {
      status
      message
      data
    }
  }
`;

/** add|update subscription plan */
const createAddUpdatePlan = gql`
  mutation addUpdatePlan(
    $plan_id: String
    $title: String!
    $subtitle: String!
    $no_of_student: String!
    $amount: String!
    $description: [String!]!
  ) {
    addUpdatePlan(
      plan_id: $plan_id
      title: $title
      subtitle: $subtitle
      no_of_student: $no_of_student
      amount: $amount
      description: $description
    ) {
      status
      message
      data
    }
  }
`;

/** get plan by id */
const getSubscriptionPlanById = gql`
  query getSubscriptionPlanById($plan_id: String!) {
    getSubscriptionPlanById(plan_id: $plan_id) {
      status
      message
      data
    }
  }
`;

/** get plan by id */
const addSubscriptionPlans = gql`
  mutation addSubscriptionPlans(
    $plan_id: String!
    $price: String!
    $coupon: String
  ) {
    addSubscriptionPlans(plan_id: $plan_id, price: $price, coupon: $coupon) {
      status
      message
      data
    }
  }
`;

/** get subscription list */
export const mutateCreateGetSubscriptionList = (
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createGetSubscriptionList,
    fetchPolicy: "no-cache",
  });
};

/** get subscription plan list */
export const queryGetSubscriptionPlanList = (
  client: ApolloClient<NormalizedCacheObject>
) => {
  return client.query({
    query: createGetSubscriptionPlanList,
    fetchPolicy: "no-cache",
  });
};

/** add|update plan */
export const mutateAddUpdatePlan = (
  request: any,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddUpdatePlan,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** get plan by id  */
export const queryCreateGetPlanById = (
  request: any,
  client: ApolloClient<NormalizedCacheObject>
) => {
  return client.query({
    query: getSubscriptionPlanById,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/** get paypal url  */
export const queryGetPaypalPaymentByPlanId = (
  request: any,
  client: ApolloClient<NormalizedCacheObject>
) => {
  return client.query({
    query: addSubscriptionPlans,
    fetchPolicy: "no-cache",
    variables: request,
  });
};
