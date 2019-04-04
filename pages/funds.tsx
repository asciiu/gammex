import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import gql from '../lib/gql'
import * as React from "react";

export default class Fund extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    return {
      summary: summary.userSummary
    }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "funds"
    }

    return (
      <Layout {...props}>
        <Row>
          User funds Page. 
        </Row>
      </Layout>
    )
  }
}