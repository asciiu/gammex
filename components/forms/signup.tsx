import {
  Form, Input, Tooltip, Icon, Select, Checkbox, Button, AutoComplete
} from 'antd';
import Recaptcha from 'react-recaptcha'
import * as React from "react";
import { Mutation} from "react-apollo";
import { ApolloError } from 'apollo-client';
import redirect from '../../lib/redirect'
import mygql from '../../lib/gql'
  
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

interface RegistrationFormProps {
  form: any;
  apolloClient: any;
}
  

class RegistrationForm extends React.Component<RegistrationFormProps, any> {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    isHuman: false,
    loading: false
  };

  handleSignupComplete = (data) => {
    this.setState({ loading: true });
    setTimeout(() => {
      let email = data.signup.email;
      redirect({}, `/verify?email=${email}`);
    }, 3000);
  }

  handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleError = (error: ApolloError) => {
    if (error.message.includes("users_username_key")) {
      this.props.form.setFields({
        username: {
          value: this.props.form.getFieldValue("username"),
          errors: [new Error('Try a different username.')],
        }
      });
    }
    if (error.message.includes("users_email_key")) {
      this.props.form.setFields({
        email: {
          value: this.props.form.getFieldValue("email"),
          errors: [new Error('This email is already registered.')],
        },
      });
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Both passwords do not match!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  recaptchaLoaded = () => {
    console.log('Done!!!!')
  }
  
  recaptchaCallback = (response) => {
    if (response) {
      this.setState({
        isHuman: true 
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const { loading } = this.state

    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={(
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>I have read the <a href="">agreement</a></Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Recaptcha
            sitekey="6Lf2p4sUAAAAAJNKgeLMkw2RZT-GTJ56Vb85PXdk"
            render="explicit"
            verifyCallback={this.recaptchaCallback}
            onloadCallback={this.recaptchaLoaded}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Mutation 
              key="signup"
              mutation={mygql.SignupMutation}
              onCompleted={this.handleSignupComplete}
              onError={this.handleError}
            >
              {(signup, { data, error }) => (
                <Button key="primary" type="primary" 
                  loading={loading}
                  onClick={e => {
                    const { isHuman } = this.state
                    e.preventDefault();
                
                    if (!isHuman) {
                      alert("Are you a robot?")
                    } else {
                      this.props.form.validateFieldsAndScroll((err, values) => {
                        if (!values.agreement) {
                          alert("Please agree to terms of service.");
                        } else if (!err) {
                          signup({ variables: { 
                            email: values.email, 
                            username: values.username, 
                            password: values.password, 
                          }})
                        }
                      });
                    }
                  }}
                >
                  Register 
                </Button>
              )} 
            </Mutation>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm
