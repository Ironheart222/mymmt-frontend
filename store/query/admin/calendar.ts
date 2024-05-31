import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { CalendarParam } from "../../Interface";

/* Add Vacation Data */
const createAddVacationInfo = gql`
    mutation addVacationInfo(
        $title: String!
        $country: String!
        $start_date: String!
        $end_date: String!
    ){
        addVacationInfo(title: $title,country: $country,start_date: $start_date,end_date: $end_date){
            status
            message
            data
        }
    }
`;

/* Get Vacation List */
const createGetVacationList = gql`
    query getVacationList(
        $country: String!
    ){
        getVacationList(country: $country){
            id
            title
            country
            start_date
            end_date
            year
            created_date
            updated_date
            active
        }
    }
`;



/*add vacation mutation */
export const mutateCreateAddVacation = (request: CalendarParam,adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.mutate({
		mutation: createAddVacationInfo,
		fetchPolicy: 'no-cache',
        variables: request
	});
};

/*get vacation list */
export const mutateCreateGetVacationList = (request: string,adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.query({
		query: createGetVacationList,
		fetchPolicy: 'no-cache',
        variables: {
            country: request
        }
	});
};