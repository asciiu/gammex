import { Row, Col, Carousel } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'
import * as React from "react";
import * as CSS from 'csstype';


export default class About extends React.Component<any, any> {
  static async getInitialProps (context: any) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return { user: loggedInUser.getUser }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps
    };
    const quoteStyle = { 
      color: 'rgba(0,0,0,.3)',
      textAlign: "center" as CSS.TextAlignProperty
    };
    const aboutStyle = { 
      color: "#001529",
      textAlign: "center" as CSS.TextAlignProperty
    };

    return (
      <Layout {...props}>
        <Row>
          <Col span={4} offset={2} style={quoteStyle}>
            <p>“There is no fire like passion, there is no shark like hatred, 
              there is no snare like folly, there is no torrent like greed.”</p> 
            <p>- Siddharta Gautama</p>
          </Col>
          <Col span={10} offset={4} style={aboutStyle}>
              <div>
                <h1>Welcome to Reaper!</h1>
                <p>There are many sites like this, but this one is special. This site was designed
                  to pay you money in crypto.</p>
                <p>As the saying goes you reap what you sow. 
                  You can grind out earnings in a variety of games. Each game offers an exciting challenge.
                </p>
                <p>Play online with or against others in our arena. The arena is a multplier game of risk 
                  that allows you to play a skill based game against other players. Players may choose to cooperate
                  or they can battle other players for a chance to win big. Read more about the arena here!
                </p>
                <p>If you're still unsure of what this site is. Read the story. All of it!</p>  
              </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}