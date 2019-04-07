import Layout, { LayoutProps } from '../components/layout'
import Asteroids from '../sketches/asteroids/sketch'
import P5Wrapper from '../components/p5Wrapper'
import gql from '../lib/gql'
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
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    if (!summary.userSummary) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return { summary: summary }
  }

  render() {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "sketch"
    };

    return (
      <Layout {...props}>
        <P5Wrapper sketch={this.state.sketch} /> 
      </Layout>
    );
  }
}