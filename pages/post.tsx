import Layout from '../components/layout'
import fetch from 'isomorphic-unfetch'

const Post = (props: any) => (
  <Layout {...props}>
    <h1>{props.pageProps.show.name}</h1>
    {/* <p>{props.pageProps.show.summary.replace(/<[/]?p>/g, '')}</p> */}
    <p dangerouslySetInnerHTML={{__html: props.pageProps.show.summary}}/>
    <img src={props.pageProps.show.image.medium} />
  </Layout>
)
  
Post.getInitialProps = async function(context) {
  const { id } = context.query
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
  const show = await res.json()

  console.log(`Fetched show: ${show.name}`)

  return { show }
}

export default Post