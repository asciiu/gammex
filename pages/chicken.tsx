import Layout, { LayoutProps } from '../components/layout'
import ChickFila from '../sketches/chicken/sketch'
import P5Wrapper from '../components/p5Wrapper'
import gql from '../lib/gql'
import redirect from '../lib/redirect'
import * as React from "react";
import { Row, Col } from 'antd';

export default class Chicken extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
		  sketch: ChickFila
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
      title: "chicken"
    };
    const canvasStyle = {
      width: '85%',
      height: '400px',
    };

    return (
      <Layout {...props}>
        <Row>
          <Col span={20}>
            <div id="sketch" style={canvasStyle} />
            <P5Wrapper sketch={this.state.sketch} /> 
          </Col>
          <Col span={4}></Col>
        </Row>
      </Layout>
    );
  }
}