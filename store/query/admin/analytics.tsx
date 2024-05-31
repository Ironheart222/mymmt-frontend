import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";


/** get revenue analytics data */
const createGetRevenueDataQuery = gql`
    query getRevenueData(
        $filter_by: String!
        $start_date: Float
        $end_date: Float
    ){
        getRevenueData(
            filter_by: $filter_by,
            start_date: $start_date,
            end_date: $end_date
        ){
            status
            message
            data
        }
    }
`

/** get newly added analytics data */
const createGetNewlyMemberDataQuery = gql`
    query getNewlyAddedMember(
        $filter_by: String!
        $start_date: Float
        $end_date: Float
    ){
        getNewlyAddedMember(
            filter_by: $filter_by,
            start_date: $start_date,
            end_date: $end_date
        ){
            status
            message
            data
        }
    }
`

/** get member reports data */
const createGetMemberReportDataQuery = gql`
    query getMemberReportData(
        $start_date: Float!
        $end_date: Float!
    ){
        getMemberReportData(
            start_date: $start_date,
            end_date: $end_date
        ){
            status
            message
            data
        }
    }
`

/** get reports data */
const createGetRevenueReportDataQuery = gql`
    query getRevenueReportData(
        $start_date: Float!
        $end_date: Float!
    ){
        getRevenueReportData(
            start_date: $start_date
            end_date: $end_date
        ){
            status
            message
            data
        }
    }
`

/** get revenue analytics data  */
export const queryGetRevenueData = (request:any, adminClient: ApolloClient<NormalizedCacheObject>) => {
    return adminClient.query({
        query: createGetRevenueDataQuery,
        fetchPolicy: 'no-cache',
        variables: request
    });
};

/** get newly added member data  */
export const queryGetNewMemberData = (request:any, adminClient: ApolloClient<NormalizedCacheObject>) => {
    return adminClient.query({
        query: createGetNewlyMemberDataQuery,
        fetchPolicy: 'no-cache',
        variables: request
    });
};

/** get member data report  */
export const queryGetMemberReportData = (request:any, adminClient: ApolloClient<NormalizedCacheObject>) => {
    return adminClient.query({
        query: createGetMemberReportDataQuery,
        fetchPolicy: 'no-cache',
        variables: request
    });
};

/** get revenue data report  */
export const queryGetRevenueReportData = (request:any, adminClient: ApolloClient<NormalizedCacheObject>) => {
    return adminClient.query({
        query: createGetRevenueReportDataQuery,
        fetchPolicy: 'no-cache',
        variables: request
    });
};