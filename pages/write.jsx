import { Row, Col } from 'antd';
import Layout, { LayoutProps } from '../components/layout'
import gql from '../lib/gql'
import * as React from "react";
import redirect from '../lib/redirect'
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

export default class Write extends React.Component {
  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient)
    if (!summary.userSummary) {
      // Already signed in? No need to continue.
      // Throw them back to the main page
      redirect(context, '/')
    }
    return {
      summary: summary
    }
  }

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
  }

  onChange = (editorState) => this.setState({editorState}); 

  render = () => {
    const props = {
      apolloClient: this.props.apolloClient, 
      pageProps: this.props.pageProps,
      title: "profile"
    }

    return (
      <Layout {...props}>
        <Row>
          <Editor 
            editorState={this.state.editorState} 
            onChange={this.onChange}
            placeholder="This is some text." />
        </Row>
      </Layout>
    )
  }
}