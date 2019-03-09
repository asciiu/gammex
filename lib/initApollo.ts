import { ApolloClient, InMemoryCache, NormalizedCacheObject } from 'apollo-boost'
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import cookie from 'cookie'
import fetch from 'isomorphic-unfetch'
import { isBrowser } from './isBrowser';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

interface Options {
  getToken: () => string
  getRefresh: () => string
}

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch
}

function create (initialState: any, { getToken, getRefresh }: Options) {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8080/query',
    credentials: 'same-origin'
  })

  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    const refresh = getRefresh()
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        refresh: refresh ? refresh: '',
      }
    }
  })

  const errorLink = onError(({ operation, graphQLErrors, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.message == "unauthorized") {
          const context = operation.getContext();
          const { response: { headers } } = context;
          if (headers) {
            const auth = headers.get('Set-Authorization');
            const refresh = headers.get('Set-Refresh');
            if (auth && refresh) {
              document.cookie = cookie.serialize('token', auth, {
                maxAge: 24 * 60 * 60 // 1 day
              })
              document.cookie = cookie.serialize('refresh', refresh, {
                maxAge: 24 * 60 * 60 // 1 day
              })
              // Now, pass the original operation to the next link
              // in the chain. This retries it with new tokens
              return forward(operation);
            } 
          }
        }
      }
    }
  });

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([
      errorLink,
      authLink,
      httpLink,
    ]),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo (initialState: any, options: Options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}