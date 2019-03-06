import { Row, Col } from 'antd';
import Layout from '../components/layout'
import Forgot from '../components/forms/forgot'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class ForgotPass extends React.Component {
  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    if (loggedInUser.getUser) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return {}
  }

  render = () => {
    return (
      <Layout {...this.props}>
        <Row>
          <Col span={8} offset={8}>
            <Forgot/>
          </Col>
        </Row>
      </Layout>
    )
  }
}