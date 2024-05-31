import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Config from "../config/config";
import { UserType } from "./Interface";

const forbiddenRoute = ["/lesson-library","lesson-vault"]

const clientLink = createHttpLink({
    uri: Config.API_URL,
});

const uploadClientLink = createUploadLink({
    uri: Config.API_URL,
});

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            localStorage.clear();
            window.location.replace("/")
          }

          if (err.extensions?.code === 'PLAN_EXPIRED') {
            // do something while plan is expired
            const accessToken = localStorage.getItem("user_token");
            if (forbiddenRoute.includes(window.location.pathname)) {
              if (!accessToken) {
                window.location.replace("/");
              } else {
                window.location.replace("/parentportal/subscription-plan");
              }
            }
          }
        }
      }
      if (networkError && "result" in networkError) {
        // put the logic for the network error handling
        for (const err of networkError.result.errors) {
            if (err.extensions?.code === 'UNAUTHENTICATED') {
              localStorage.clear();
              window.location.replace("/")
            }
          }
      }
    }
  );

const userAuthLink = setContext((_, { headers }) => {
    const userToken = localStorage.getItem("user_token") ? JSON.parse(localStorage.getItem("user_token") || "{}") : null
    return {
        headers: {
            ...headers,
            authorization: userToken ? `Bearer ${userToken}` : "",
            user_type: UserType.USER
        }
    }
});

const userClient = new ApolloClient({
    link: from([errorLink, userAuthLink, clientLink]),
    cache: new InMemoryCache(),
});

const adminAuthLink = setContext((_, { headers }) => {
    const adminToken = localStorage.getItem("admin_token") ? JSON.parse(localStorage.getItem("admin_token") || "{}") : null
    return {
        headers: {
            ...headers,
            authorization: adminToken ? `Bearer ${adminToken}` : "",
            user_type: UserType.ADMIN
        }
    }
});

const adminClient = new ApolloClient({
    link: adminAuthLink.concat(clientLink),
    cache: new InMemoryCache(),
});

const uploadClient = new ApolloClient({
    link: adminAuthLink.concat(uploadClientLink),
    cache: new InMemoryCache(),
});

const userUploadClient = new ApolloClient({
    link: from([errorLink, userAuthLink, uploadClientLink]),
    // link: userAuthLink.concat(uploadClientLink),
    cache: new InMemoryCache
})

export { userClient, adminClient, uploadClient, userUploadClient};