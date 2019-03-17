import { Row, Col, Carousel } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import Link from 'next/link'
import checkLoggedIn from '../lib/checkLoggedIn'
import * as React from "react";
import * as CSS from 'csstype';


const PostLink = props => (
  <li>
    <Link href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
)

export default class Story extends React.Component<any, any> {
  static async getInitialProps (context: any) {
    //const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    const stories = [
      {
        title: "Introduction",
      },
      {
        title: "Solitude",
      },
      {
        title: "Working for someone else sucks!",
      },
    ]; 
    return { stories: stories };
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
    };
    const quoteStyle = { 
      color: 'rgba(0,0,0,.3)',
      textAlign: "center" as CSS.TextAlignProperty
    };
    const aboutStyle = { 
      color: "#001529",
      textAlign: "center" as CSS.TextAlignProperty
    };
    const tocStyle = { 
      color: "#001529",
      textAlign: "left" as CSS.TextAlignProperty
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
                <p>My story is true. I had to obfiscate names and certain circumstances to hide
                  identities, but otherwise everything that I write is from yours truly. - Axl</p>
                <ul style={tocStyle}>
                  {this.props.pageProps.stories.map( (story:any)  => (
                    <PostLink key={story.title} title={story.title} />
                  ))}
                </ul>
              </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}