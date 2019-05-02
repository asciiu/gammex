import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import gql from '../lib/gql'
import * as React from "react";
import redirect from '../lib/redirect'

export default class Write extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    if (!summary.userSummary) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }
    return {
      summary: summary
    }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "profile"
    }

    return (
      <Layout {...props}>
        <Row>
          Write Page. 
        </Row>
      </Layout>
    )
  }
}