import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import Forgot from '../components/forms/forgot'
import gql from '../lib/gql'
import redirect from '../lib/redirect'
import * as React from "react";
import { any } from 'prop-types';

export default class VerifyEmail extends React.Component<any, any> {
  state = {
    email: ''
  }

  static async getInitialProps (context) {
    const { loggedInUser } = await gql.checkLoggedIn(context.apolloClient)
    if (loggedInUser.getUser) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return {email: context.query.email}
  }

  render = () => {
    const { email } = this.props.pageProps;

    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps
    }

    return (
      <Layout {...props}>
        <Row>
          <Col span={8} offset={8}>
            We've sent a confirmation email to <b>{email}</b>. 
            Please verify your email account before you login. 
          </Col>
        </Row>
      </Layout>
    )
  }
}