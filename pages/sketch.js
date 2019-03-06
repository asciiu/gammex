import Layout from '../components/layout'
import Asteroids from '../sketches/asteroids/sketch'
import P5Wrapper from '../components/p5Wrapper'
import checkLoggedIn from '../lib/checkLoggedIn'

export default class Sketch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			sketch: Asteroids
		};
  }

  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)
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