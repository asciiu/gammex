import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import Signup from '../components/forms/signup'
import gql from '../lib/gql'
import redirect from '../lib/redirect'
import * as React from "react";

export default class SignUp extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { loggedInUser } = await gql.checkLoggedIn(context.apolloClient)
    if (loggedInUser.getUser) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return {}
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps
    }

    return (
      <Layout {...props}>
        <Row>
          <Col span={12} offset={4}>
            <Signup apolloClient={props.apolloClient}/>
          </Col>
        </Row>
      </Layout>
    )
  } 
}