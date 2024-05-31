import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";

/* get all child  */
const createChildListQuery = gql`
	query {
		getChildList{
			child_id
			child_name
			child_age
			birth_date
			school_name
			class_no
			stage_no
			gender
			video_allowed_count
			past_video_no
			curr_video_no
			last_changed_week
			parent_id
			profile_image_url
			keep_holidays
			created_date
			updated_date
		}
	}
	`;

	/* get single child info */
	const createSingleChildQuery = gql`
	query getChildInfo($child_id: Float!){
		getChildInfo(child_id:$child_id){
			child_id
			child_name
			child_age
			birth_date
			school_name
			class_no
			stage_no
			gender
			video_allowed_count
			past_video_no
			curr_video_no
			last_changed_week
			parent_id
			profile_image_url
			keep_holidays
			created_date
			updated_date
		}
	}
`;


/*get all child mutation */
export const queryGetAllChildInfo = (userClient: ApolloClient<NormalizedCacheObject>) => {
	return userClient.query({
		query: createChildListQuery,
		fetchPolicy: 'no-cache'
	});
};

/*get single child info mutation */
export const queryGetSingleChildInfo = (request: number,userClient: ApolloClient<NormalizedCacheObject>) => {
	return userClient.query({
		query: createSingleChildQuery,
		fetchPolicy: 'no-cache',
		variables: {
			child_id: request
		}
	});
};

