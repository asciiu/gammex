import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import gql from '../lib/gql'
import * as React from "react";

export default class Fund extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    return {
      summary: summary
    }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "support"
    }

    return (
      <Layout {...props}>
        <Row>
          Customer support page. 
        </Row>
      </Layout>
    )
  }
}