import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import Forgot from '../components/forms/forgot'
import gql from '../lib/gql'
import redirect from '../lib/redirect'
import * as React from "react";
import { any } from 'prop-types';

export default class ForgotPass extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    if (summary.userSummary) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return {}
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "forgot"
    }

    return (
      <Layout {...props}>
        <Row>
          <Col span={8} offset={8}>
            <Forgot/>
          </Col>
        </Row>
      </Layout>
    )
  }
}