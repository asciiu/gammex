import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import gql from '../lib/gql'
import * as React from "react";

export default class Profile extends React.Component<any, any> {
  static async getInitialProps (context) {
    const { loggedInUser } = await gql.checkLoggedIn(context.apolloClient)
    return {
      user: loggedInUser.getUser
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
          Profile Page. 
        </Row>
      </Layout>
    )
  }
}