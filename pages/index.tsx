import Layout, { LayoutProps } from '../components/layout'
import { HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis } from 'react-vis'
import { Row, Col } from 'antd'
import checkLoggedIn from '../lib/checkLoggedIn'
import 'react-vis/dist/style.css'
import 'antd/dist/antd.css'
import * as React from "react";

const contentStyle = { color: '#001529' }

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
          <Col span={12} offset={2} style={contentStyle}>
            <h1>Play some games, make some money, and when you are ready to take your earnings to a new level, 
               enter the arena. Each game is designed to pay you money in crypto!  
            </h1>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          </Col>
          <Col span={12}>
            <h1>As the saying goes you reap what you sow. 
               You can grind out earnings in a variety of games. Each game offers an exciting challenge.
            </h1>
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
            <h1>Play online with or against others in our arena. The arena is a multplier game of risk 
                that allows you to play a skill based game against other players. Players may choose to cooperate
                or they can battle other players for a chance to win big!
            </h1>
          </Col>
        </Row>
      </Layout>
    )
  }
}