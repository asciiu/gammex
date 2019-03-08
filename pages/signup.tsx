import { Row, Col } from 'antd';
import Layout from '../components/layout'
import Signup from '../components/forms/signup'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import * as React from "react";

export default class SignUp extends React.Component {
  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    if (loggedInUser.getUser) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return {}
  }

  render = () => {
    return (
      <Layout {...this.props}>
        <Row>
          <Col span={12} offset={4}>
            <Signup/>
          </Col>
        </Row>
      </Layout>
    )
  } 
}