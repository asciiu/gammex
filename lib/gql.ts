import gql from 'graphql-tag'
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

/********************************************************** 
 * queries 
 **********************************************************/
const CheckLoggedIn = (apolloClient: ApolloClient<NormalizedCacheObject>) => 
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

/********************************************************** 
 * mutations 
 **********************************************************/
const LoginMutation = gql`
  mutation Login ($email: String!, $password: String!, $remember: Boolean!) {
    login(email: $email, password: $password, remember: $remember) {
      jwt
      refresh
    }
  }
`

const SignupMutation = gql`
  mutation Signup ($email: String!, $username: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      id 
      email
      emailVerified
      username
      passwordHash
    }
  }
`


export default {
  CheckLoggedIn,
  LoginMutation,
  SignupMutation,
}
