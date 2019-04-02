import { Row, Col, Carousel } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import Link from 'next/link'
import gql from '../lib/gql'
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
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
    const data = await res.json()
    const { loggedInUser } = await gql.checkLoggedIn(context.apolloClient)

    console.log(`Show data fetched. Count: ${data.length}`)

    return {
      shows: data,
      user: loggedInUser.getUser
    }
  }

  render = () => {
    const props: LayoutProps = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
    };
    const quoteStyle = { 
      color: 'rgba(0,0,0,.3)',
      fontFamily: 'Lyon Text,Georgia,serif',
      textAlign: "center" as CSS.TextAlignProperty
    };
    const aboutStyle = { 
      color: "#001529",
      fontFamily: 'Lyon Text,Georgia,serif',
      fontSize: '20px'
    };
    const tocStyle = { 
      color: "#001529",
      fontFamily: 'Lyon Text,Georgia,serif',
      textAlign: "left" as CSS.TextAlignProperty,
      fontSize: '16px'
    };

    return (
      <Layout {...props}>
        <Row>
          <Col span={4} offset={2} style={quoteStyle}>
            <p>“Everything you can imagine is real.”</p> 
            <p>- Pablo Picasso</p>
          </Col>
          <Col span={10} offset={4} style={aboutStyle}>
              <div>
                <h1>freemoon</h1>
                <p>A programmer's tale.
                </p>
                <ul style={tocStyle}>
                  {props.pageProps.shows.map(({show}) => (
                    <li key={show.id}>
                      <Link as={`/story/${show.id}`} href={`/post?id=${show.id}`}>
                        <a>{show.name}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}