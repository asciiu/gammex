import App, { Container } from 'next/app'
import React from 'react'
import withApolloClient from '../lib/withApolloClient'
import { ApolloProvider } from 'react-apollo'

class MyApp extends App<any> {
  render () {
    const { Component, pageProps, apolloClient } = this.props
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...this.props} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)