import gql from 'graphql-tag'
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

export default (apolloClient: ApolloClient<NormalizedCacheObject>) =>
  apolloClient
    .query({
      query: gql`
        query GetUser {
          getUser {
            id
            username 
            email
          }
        }
      `
    })
    .then(({ data }) => {
      return { loggedInUser: data }
    })
    .catch(() => {
      // Fail gracefully
      return { loggedInUser: {} }
    })