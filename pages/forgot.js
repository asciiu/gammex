import { Row, Col } from 'antd';
import Layout from '../components/layout'
import Forgot from '../components/forms/forgot'

export default class ForgotPass extends React.Component {
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