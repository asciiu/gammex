import Layout from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd'


export default class CreateJesuis extends React.Component {
  constructor(props) {
    super(props);
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

  componentDidMount(){
    var canvas = ReactDOM.findDOMNode(this.refs.canvas);
    canvas.style.backgroundColor = "#ff0000";

    this.stage = new createjs.Stage(canvas);
    var circle = new createjs.Shape();
    circle.graphics.beginFill("Crimson").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    this.stage.addChild(circle);
    createjs.Tween.get(circle, {loop: true})
      .to({x: 400}, 1000, createjs.Ease.getPowInOut(4))
      .to({alpha: 0, y: 75}, 500, createjs.Ease.getPowInOut(2))
      .to({alpha: 0, y: 125}, 100)
      .to({alpha: 1, y: 100}, 500, createjs.Ease.getPowInOut(2))
      .to({x: 100}, 800, createjs.Ease.getPowInOut(2));

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.stage);
  }

  render() {
    //const props: LayoutProps = {
    //  apolloClient: this.props.apolloClient, 
    //  pageProps: this.props.pageProps
    //};

    return (
      <Layout {...this.props}>
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <canvas ref="canvas" width="600" height="200"></canvas>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}