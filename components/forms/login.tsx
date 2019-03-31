import { Button, Form, Icon, Input, Checkbox, Modal } from 'antd';
import {withRouter} from 'next/router'
import gql from 'graphql-tag';
import { Mutation } from "react-apollo";
import cookie from 'cookie'
import redirect from '../../lib/redirect'
import * as React from "react";
import { ApolloError } from 'apollo-client';


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

interface LoginModalProps {
  form: any;
  onRef(ref: any): void;
  apolloClient: any;
}


class LoginModal extends React.Component<LoginModalProps, any> {
  state = {
    visible: false,
    loading: false
  }

  componentDidMount() {
    this.props.onRef(this)
  }
  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  handleComplete = (data) => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.close()
      this.props.apolloClient.cache.reset().then(() => {
        redirect({}, '/sketch')
      })
    }, 3000);

    document.cookie = cookie.serialize('token', data.login.jwt, {
      maxAge: 24 * 60 * 60 // 1 day
    })

    if (data.login.refresh) {
      document.cookie = cookie.serialize('refresh', data.login.refresh)
    } else {
      // delete preexisting refresh 
      document.cookie = cookie.serialize('refresh', data.login.refresh, {
        maxAge: -1
      })
    }
  }

  handleError = (error: ApolloError) => {
    if (error.message.includes("incorrect password/email")) {
      this.props.form.setFields({
        email: {
          value: this.props.form.getFieldValue("email"),
          errors: [new Error('This email may be invalid.')],
        },
        password: {
          value: this.props.form.getFieldValue("password"),
          errors: [new Error('Or your password may be incorrect!')],
        }
      });
    }

    if (error.message.includes("account not verified")) {
      this.props.form.setFields({
        email: {
          value: this.props.form.getFieldValue("email"),
          errors: [new Error('Email account not verified.')],
        },
      });
    }
  }

  close = () => {
    this.props.form.resetFields()
    this.setState({
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
              rules: [{ required: true, message: 'Please input your email!' }],
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
            <Link href="/forgot" onClick={this.close}>Forgot password</Link>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
  
const WrappedLoginForm = Form.create()(LoginModal)
export default WrappedLoginForm