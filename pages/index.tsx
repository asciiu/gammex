import Layout, { LayoutProps } from '../components/layout'
import { HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis } from 'react-vis'
import { Row, Col } from 'antd'
import checkLoggedIn from '../lib/checkLoggedIn'
import 'react-vis/dist/style.css'
import 'antd/dist/antd.css'
import * as React from "react";

export default class Index extends React.Component<any, any> {
  layoutProps: LayoutProps;

  constructor(props: any) {
    super(props);
    this.layoutProps = {
      pageProps: props.pageProps,
      apolloClient: props.apolloClient
    };
  }

  static async getInitialProps (context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return { user: loggedInUser.getUser }
  }

  render () {

    return (
      <Layout {...this.layoutProps}>
        <Row>
          <Col span={12}>
          </Col>
          <Col span={12}>
            <XYPlot width={300} height={300}>
              <HorizontalGridLines/>
              <LineSeries
                  data={[
                      {x: 1, y: 10},
                      {x: 2, y: 5},
                      {x: 3, y: 15}
                  ]}/>
              <XAxis/>
              <YAxis/>
            </XYPlot>
          </Col>
        </Row>
      </Layout>
    )
  }
}