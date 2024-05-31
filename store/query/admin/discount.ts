import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { DiscountCode } from "../../Interface";

/* Add Discount Code */
const createAddDiscountCode = gql`
  mutation addDiscountCode(
    $code: String!
    $currency: String!
    $amount: Float!
    $percent: Float!
    $amount_type: String!
    $plan_id: String!
    $expiry_date: Float
    $duration: String
    $duration_in_months: String
    $reference_plan_id: String
  ) {
    addDiscountCode(
      code: $code
      currency: $currency
      amount: $amount
      percent: $percent
      amount_type: $amount_type
      plan_id: $plan_id
      expiry_date: $expiry_date
      duration: $duration
      duration_in_months: $duration_in_months
      reference_plan_id: $reference_plan_id
    ) {
      status
      message
      data
    }
  }
`;

/* Get Discount Code */
const createGetDiscountCode = gql`
  query {
    getDiscountList {
      status
      message
      data
    }
  }
`;

/* Get Discount Code */
const createDeleteDiscountCode = gql`
  mutation deleteDiscountCode($discount_id: String!) {
    deleteDiscountCode(discount_id: $discount_id) {
      status
      message
      data
    }
  }
`;

/*add discount mutation */
export const mutateCreateAddDiscountCode = (
  request: Partial<DiscountCode>,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createAddDiscountCode,
    fetchPolicy: "no-cache",
    variables: request,
  });
};

/*get discount list */
export const mutateCreateGetDiscountList = (
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.query({
    query: createGetDiscountCode,
    fetchPolicy: "no-cache",
  });
};

/*add discount mutation */
export const mutateCreateDeleteDiscountCode = (
  request: Partial<DiscountCode>,
  adminClient: ApolloClient<NormalizedCacheObject>
) => {
  return adminClient.mutate({
    mutation: createDeleteDiscountCode,
    fetchPolicy: "no-cache",
    variables: {
      discount_id: request,
    },
  });
};
