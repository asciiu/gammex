import Layout, { LayoutProps } from '../components/layout'
import Asteroids from '../sketches/asteroids/sketch'
import P5Wrapper from '../components/p5Wrapper'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import * as React from "react";

export default class Sketch extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
		  sketch: Asteroids
		};
  }

  static async getInitialProps (context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    if (!loggedInUser.getUser) {
      // Not signed in.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return { user: loggedInUser.getUser }
  }

  render() {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps
    };

    return (
      <Layout {...props}>
        <P5Wrapper sketch={this.state.sketch} /> 
      </Layout>
    );
  }
}