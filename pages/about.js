import Layout from '../components/layout'

export default class About extends React.Component {
  render = () => {
    return (
      <Layout apolloClient={this.props.apolloClient}>
        <p>Jo mama</p>
      </Layout>
    )
  }
}