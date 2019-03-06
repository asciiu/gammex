import Layout from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'

export default class About extends React.Component {
  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    return { user: loggedInUser.getUser }
  }

  render = () => {
    return (
      <Layout {...this.props}>
        <p>Jo mama</p>
      </Layout>
    )
  }
}