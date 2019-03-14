import Layout from '../components/layout'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd'


export default class CreateJesuis extends React.Component {

  static async getInitialProps (context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient);
    if (!loggedInUser.getUser) {
      // Not signed in.
      // Throw them back to the main page
      redirect(context, '/');
    }

    return { user: loggedInUser.getUser }
  }

  btc;
  canvas;
  clouds = [];
  squeakID = "squeak";
  bubbleID = "bubble";

  constructor(props) {
    super(props);
  }

  handleComplete = () => {
    //this.btc = new createjs.Bitmap("/static/clouds/btc.png");
    this.btc = new createjs.Bitmap("/static/clouds/bubble.png");
    this.btc.scaleX = 0.1;
    this.btc.scaleY = 0.1;
    const cloud1 = new createjs.Bitmap("/static/clouds/cloud1.png");
    const cloud2 = new createjs.Bitmap("/static/clouds/cloud1.png");
    const cloud3 = new createjs.Bitmap("/static/clouds/cloud2.png");
    const cloud4 = new createjs.Bitmap("/static/clouds/cloud3.png");
    const cloud5 = new createjs.Bitmap("/static/clouds/cloud1.png");
    const cloud6 = new createjs.Bitmap("/static/clouds/cloud4.png");
    const cloud7 = new createjs.Bitmap("/static/clouds/cloud1.png");
    this.clouds = [cloud1, cloud2, cloud3, cloud4, cloud5, cloud6, cloud7]

    for (const cloud of this.clouds) {
      // init off screen
      cloud.x = -this.width;
      //cloud.y = Math.floor(Math.random() * this.height) + 1;
      this.stage.addChild(cloud);
    }

    this.btc.x = 300;
    this.btc.y = 300;
    this.stage.addChild(this.btc);

    createjs.Sound.registerSound("static/squeakyToy.mp3", this.squeakID);
    createjs.Sound.registerSound("static/clouds/bubble.mp3", this.bubbleID);
  }

  componentDidMount = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvas.style.backgroundColor = "#001529";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.stage = new createjs.Stage(this.canvas);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    document.onkeydown = this.handleKey;

    const queue = new createjs.LoadQueue();
    queue.on("complete", this.handleComplete, this);
    queue.loadFile("/static/clouds/cloud1.png");
    queue.loadFile("/static/clouds/cloud2.png");
    queue.loadFile("/static/clouds/cloud3.png");
    queue.loadFile("/static/clouds/cloud4.png");
    queue.loadFile("/static/clouds/btc.png");
    queue.loadFile("/static/clouds/bubble.png");
    queue.loadFile("/static/squeakyToy.mp3");
    queue.load();
  }
  
  handleKey = (event) => {
    if (event.keyCode == 32) {
      createjs.Sound.play(this.bubbleID);

      createjs.Tween.get(this.btc)
        .to({y: this.btc.y-100}, 300, createjs.Ease.getPowOut(2))
        .to({y: this.height}, 700, createjs.Ease.getPowIn(2));
    }
    event.preventDefault();
  }

  handleTick = (event) => {
    // Actions carried out each tick (aka frame)
    //if (!event.paused) {
    //    // Actions carried out when the Ticker is not paused.
    //}
    this.stage.update();
    
    for (const cloud of this.clouds) {
      if (cloud.getBounds() && cloud.x <= -cloud.getBounds().width) {
        cloud.x = this.width;
        cloud.y = Math.floor(Math.random() * this.height) + 1;  

        const time = Math.floor(Math.random() * 15000) + 7000;
        createjs.Tween.get(cloud)
          .to({x: -cloud.getBounds().width}, time);
      }
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