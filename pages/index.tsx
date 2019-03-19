import Layout, { LayoutProps } from '../components/layout'
import { HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis } from 'react-vis'
import { Row, Col } from 'antd'
import gql from '../lib/gql'
import 'react-vis/dist/style.css'
import 'antd/dist/antd.css'
import * as React from "react";

const contentStyle = { 
  color: "#001529",
  fontSize: '20px',
  fontFamily: 'Lyon Text,Georgia,serif'
}

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
    const { loggedInUser } = await gql.checkLoggedIn(context.apolloClient)
    return { user: loggedInUser.getUser }
  }

  render () {

    return (
      <Layout {...this.layoutProps}>
        <Row>
          <Col span={12} offset={2} style={contentStyle}>
            Play some games, make some money, and when you are ready to take your earnings to a new level, 
            enter the Thunder Dome! Each game is designed to pay you money in crypto!  
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          </Col>
          <Col span={12} style={contentStyle}>
            Each game offers an exciting challenge that pays!
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
        <Row>
          <Col span={12} offset={2} style={contentStyle}>
            The Thunder Dome - arena!
          </Col>
        </Row>
      </Layout>
    )
  }
}