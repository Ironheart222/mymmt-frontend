import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { adminClient, uploadClient, userClient, userUploadClient } from '../apolloClient';
import { UserType } from '../Interface';

interface IntialState {
    userClient : ApolloClient<NormalizedCacheObject>;
	adminClient : ApolloClient<NormalizedCacheObject>;
	uploadClient : ApolloClient<NormalizedCacheObject>;
	userUploadClient : ApolloClient<NormalizedCacheObject>;
	userType: UserType
}

const intialState: IntialState = {
    userClient: userClient,
    adminClient: adminClient,
	uploadClient: uploadClient,
	userUploadClient: userUploadClient,
	userType: UserType.USER
};

const apolloClientSlice = createSlice({
	name: 'client',
	initialState: intialState,
	reducers: {
        UserClient: (
			state: Draft<IntialState>,
		) => {
			state.userClient;
			state.userType = UserType.USER;
		},

		AdminClient: (
			state: Draft<IntialState>,
		) => {
			state.adminClient;
			state.uploadClient;
			state.userType = UserType.ADMIN;
		},
	}
});


export const {
    UserClient,
	AdminClient
} = apolloClientSlice.actions;

export default apolloClientSlice.reducer;