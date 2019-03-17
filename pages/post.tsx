import Layout from '../components/layout'
import fetch from 'isomorphic-unfetch'
import { Row, Col } from 'antd'

const Post = (props: any) => (
  <Layout {...props}>
    <Row>
      <Col span={12} offset={3}>
        <h1>{props.pageProps.show.name}</h1>
        <img src={props.pageProps.show.image.medium} />
        <p dangerouslySetInnerHTML={{__html: sanitize(props.pageProps.show.summary)}}/>
      </Col>
    </Row>
  </Layout>
)
  

function sanitize(html: string) {
  let doc = document.createElement('div');
  doc.innerHTML = html;
  return doc.innerHTML;
}

Post.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
  const show = await res.json()

  console.log(`Fetched show: ${show.name}`)

  return { show }
}

export default Post