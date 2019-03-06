import Layout from '../components/layout'
import Asteroids from '../sketches/asteroids/sketch'
import P5Wrapper from '../components/P5Wrapper'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		  sketch: Asteroids
		};
  }

  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
    if (!loggedInUser.getUser) {
      // Not signed in.
      // Throw them back to the main page
      redirect(context, '/')
    }

    return { user: loggedInUser.getUser }
  }

  render() {
    return (
      <Layout {...this.props}>
        <P5Wrapper sketch={this.state.sketch} /> 
      </Layout>
    );
  }
}