import Layout from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd'


export default class CreateJesuis extends React.Component {
  constructor(props) {
    super(props);
    const queue = new createjs.LoadQueue();
    queue.on("complete", this.handleComplete, this);
    queue.loadFile("/static/clouds/cloud1.png");
    queue.loadFile("/static/clouds/btc.png");
    queue.load();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  handleComplete = () => {
    this.cloud1 = new createjs.Bitmap("/static/clouds/cloud1.png");
    const width = this.width;
    const height = this.height;
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    canvas.style.backgroundColor = "#001529";
    canvas.width = width;
    canvas.height = height;

    this.stage = new createjs.Stage(canvas);
    this.cloud1.x = width;
    this.cloud1.y = Math.floor(Math.random() * height) + 1  
    this.stage.addChild(this.cloud1);

    const btc = new createjs.Bitmap("/static/clouds/btc.png");
    btc.x = 300;
    btc.y = 300;
    this.stage.addChild(btc);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.handleTick);

    createjs.Tween.get(this.cloud1)
      .to({x: -500}, 10000)
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
  }

  handleTick = (event) => {
    // Actions carried out each tick (aka frame)
    //if (!event.paused) {
    //    // Actions carried out when the Ticker is not paused.
    //}
    this.stage.update();
    
    if (this.cloud1 && this.cloud1.x <= -this.cloud1.getBounds().width) {
      this.cloud1.x = this.width;
      this.cloud1.y = Math.floor(Math.random() * this.height) + 1  
      createjs.Tween.get(this.cloud1)
        .to({x: -this.cloud1.getBounds().width}, 10000)
    }
  }


  render() {
    //const props: LayoutProps = {
    //  apolloClient: this.props.apolloClient, 
    //  pageProps: this.props.pageProps
    //};
    const canvasStyle = {
      width: '100%',
      height: '100%'
    }

    return (
      <Layout {...this.props}>
        <Row>
          <Col span={3}></Col>
          <Col span={18}>
            <canvas ref="canvas" style={canvasStyle}></canvas>
          </Col>
          <Col span={3}></Col>
        </Row>
      </Layout>
    );
  }
}