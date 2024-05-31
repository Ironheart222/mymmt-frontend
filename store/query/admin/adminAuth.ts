import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { LoginParam } from "../../Interface";


/* Parent-Setting Auth  */
const createAdminAuthQuery = gql`
mutation adminLogin($email: String!,$password: String!){
	adminLogin(email_id: $email,password: $password){
	  status
	  message
	  data
	}
  }
`;


/* Get Parent List  */
const createParentListQuery = gql`
	query {
		getParentList{
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
		role
		is_active
		is_delete
		is_varified
		created_date
		updated_date
		child_detail{
			child_id
			child_name
			child_age
			birth_date
			school_name
			class_no
			stage_no
			gender
			video_allowed_count
			profile_image_url
			created_date
			updated_date
		}
		}
	}
`;

/* Update Parent Status  */
const createUpdateParentStatus = gql`
mutation updateParentStatus(
	$is_delete: Boolean!,
	$is_active: Boolean!,
	$is_verify: Boolean!,
	$parent_id: Float,
) {
	updateParentStatus(
		delete_status: $is_delete,
		active_status: $is_active,
		verify_status: $is_verify,
		parent_id: $parent_id,
	) {
		status
		messagecode
		message
		data
	}
}
`;

/* Update Parent Status  */
const createUpdateAdminDetail = gql`
	mutation updateAdminDetail(
		$name: String,
		$email: String,
		$old_password: String,
		$new_password: String
		){
		updateAdminDetail(
			name: $name,
			email: $email,
			old_password: $old_password,
			new_password: $new_password)
			{
				status
				message
				data
		    }
	}
`;

/* get admin detail */
const createGetAdminDetail = gql`
	query getAdminDetail {
		getAdminDetail {
			admin_id
			name
			email
			password
			created_date
			updated_date
			active
		}
	}
`;



/*admin login mutation */
export const mutateCreateAdminAuth = (request: LoginParam,adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.mutate({
		mutation: createAdminAuthQuery,
		fetchPolicy: 'no-cache',
		variables: request
	});
};

/*get parent list mutation */
export const mutateCreateParentList = (adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.query({
		query: createParentListQuery,
		fetchPolicy: 'no-cache',
	});
};

/*update parent status mutation */
export const mutateCreateUpadateParentStatus = (request: any,adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.query({
		query: createUpdateParentStatus,
		fetchPolicy: 'no-cache',
		variables: request
	});
};

/*update admin detail mutation */
export const mutateCreateUpadateAdminDetail = (request: any,adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.query({
		query: createUpdateAdminDetail,
		fetchPolicy: 'no-cache',
		variables: request
	});
};

/*get admin detail mutation */
export const mutateCreateGetAdminDetail = (adminClient: ApolloClient<NormalizedCacheObject>) => {
	return adminClient.query({
		query: createGetAdminDetail,
		fetchPolicy: 'no-cache',
	});
};