import { Row, Col } from 'antd';
import Layout from '../components/layout'
import Signup from '../components/forms/signup'

export default class SignUp extends React.Component {
  render = () => {
    return (
      <Layout apolloClient={this.props.apolloClient}>    
        <Row>
          <Col span={12} offset={4}>
            <Signup/>
          </Col>
        </Row>
      </Layout>
    )
  } 
}