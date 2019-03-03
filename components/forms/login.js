import { Button, Form, Icon, Input, Checkbox, Modal } from 'antd';
import {withRouter} from 'next/router'
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";

const LOGIN_MUTATION = gql`
  mutation Login ($email: String!, $password: String!, $remember: Boolean!) {
    login(email: $email, password: $password, remember: $remember) {
      jwt
      refresh
    }
  }
`


const link = ({ children, router, href, onClick }) => {
  const handleClick = (e) => {
    e.preventDefault()
    // perhaps this should be done in the LoginForm somehow?
    // close the login modal if forgot was pressed and path is already /forgot
    if (href === "/forgot" && router.pathname === "/forgot") {
      onClick()
    } else {
      router.push(href)
    }
  }

  return (
    <a href={href} onClick={handleClick} >
      {children}
    </a>
  )
}
const Link = withRouter(link)


class LoginForm extends React.Component {
  state = {
    incorrect: false,
    visible: false,
    loading: false
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  handleSubmit = (event, submitLogin) => {
    this.props.form.validateFields((err, values) => {
      event.preventDefault();
      if (!err) {
        submitLogin({ variables: { 
          email: values.email, 
          password: values.password, 
          remember: values.remember 
        }})
      } 
    });
  }

  handleComplete = (data) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.close()
    }, 3000);

    console.log(data.login)
  }

  handleError = (error) => {
    this.setState({incorrect: true})
  }

  close = () => {
    this.props.form.resetFields()
    this.setState({
      incorrect: false, 
      visible: false, 
      loading: false
    })
  }

  show = () => {
    this.setState({
      visible: true,
    })
  }

  render() {
    const hintStyle = { color: 'rgba(0,0,0,.25)' }
    const { getFieldDecorator } = this.props.form;
    const { loading, visible } = this.state

    return (
      <Modal
        title="Login"
        visible={visible}
        onCancel={this.close}
        footer={[
          <span key="error">{this.state.incorrect? "incorrect":""}</span>,
          <Button key="cancel" onClick={this.close}>Cancel</Button>,
          <Mutation 
            key="login"
            mutation={LOGIN_MUTATION}
            onCompleted={this.handleComplete}
            onError={this.handleError}
          >
            {(submitLogin, { data, error }) => (
              <Button key="login" type="primary" loading={loading} 
                onClick={e => {
                  e.preventDefault();
                  this.props.form.validateFields((err, values) => {
                    if (!err) {
                      submitLogin({ variables: { 
                        email: values.email, 
                        password: values.password, 
                        remember: values.remember 
                      }})
                    } 
                  });
                }}
              >
                Login 
              </Button>
            )}
          </Mutation>
        ]}
      >
        <Form className="login-form">
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="mail" style={hintStyle} />} placeholder="Email" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password!' }],
            })(
              <Input prefix={<Icon type="lock" style={hintStyle} />} type="password" placeholder="Password" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: false,
            })(
              <div><Checkbox>Remember me</Checkbox></div>
            )}
            <Link href="/forgot" passHref onClick={this.close}>Forgot password</Link>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
  
const WrappedLoginForm = Form.create({ name: 'normal_login' })(LoginForm)
export default WrappedLoginForm