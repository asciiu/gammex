import Layout, { LayoutProps } from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'
import * as React from "react";

export default class About extends React.Component<any, any> {
  static async getInitialProps (context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return { user: loggedInUser.getUser }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps
    }

    return (
      <Layout {...props}>
        <p>Jo mama</p>
      </Layout>
    )
  }
}