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
  bubble;
  canvas;
  clouds = [];
  spikes = [];
  squeakID = "squeak";
  bubbleID = "bubble";
  popID = "pop";
  isDead = false;

  constructor(props) {
    super(props);
  }

  handleComplete = () => {
    //this.btc = new createjs.Bitmap("/static/clouds/btc.png");
    for (let i = 1; i < 10; i++) {
      const spike = new createjs.Bitmap("/static/clouds/spike.png");
      spike.scaleX = 0.1;
      spike.scaleY = 0.1;
      spike.x = -this.width;
      spike.name = "spike";
      this.stage.addChild(spike);
      this.spikes.push(spike);
    }

    for (let i = 1; i < 3; i++) {
      const btc = new createjs.Bitmap("/static/clouds/btc.png");
      btc.scaleX = 0.7;
      btc.scaleY = 0.7;
      btc.x = -this.width;
      btc.name = "btc";
      this.stage.addChild(btc);
    }

    this.bubble = new createjs.Bitmap("/static/clouds/bubble.png");
    this.bubble.name = "bubble"
    this.bubble.scaleX = 0.1;
    this.bubble.scaleY = 0.1;
    this.bubble.x = 300;
    this.bubble.y = 300;
    this.stage.addChild(this.bubble);

    for (let i = 1; i < 3; i++) {
      const cloud1 = new createjs.Bitmap("/static/clouds/cloud1.png");
      this.clouds.push(cloud1)
      const cloud2 = new createjs.Bitmap("/static/clouds/cloud2.png");
      this.clouds.push(cloud2)
      const cloud3 = new createjs.Bitmap("/static/clouds/cloud3.png");
      this.clouds.push(cloud3)
      const cloud4 = new createjs.Bitmap("/static/clouds/cloud4.png");
      this.clouds.push(cloud4)
    }

    for (const cloud of this.clouds) {
      cloud.name = "cloud";
      // init off screen
      cloud.x = -this.width;
      //cloud.y = Math.floor(Math.random() * this.height) + 1;
      this.stage.addChild(cloud);
    }

    createjs.Sound.registerSound("static/clouds/bubble.mp3", this.bubbleID);
    createjs.Sound.registerSound("static/clouds/pop.mp3", this.popID);
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
    queue.loadFile("/static/clouds/pop.mp3");
    queue.loadFile("/static/clouds/bubble.mp3");
    queue.load();
  }
  
  handleKey = (event) => {
    if (event.keyCode == 32) {

      if (this.bubble.y < this.height && this.isDead) {
        this.isDead = false;
      }

      createjs.Sound.play(this.bubbleID);

      //const y = this.bubble.y;
      //let x = 20;
      //if (x < 20) x = 20;

      createjs.Tween.get(this.bubble)
        .to({x: this.bubble.x + 10, y: this.bubble.y-100}, 300, createjs.Ease.getPowOut(2))
        .to({y: this.bubble.y+1000}, 700, createjs.Ease.getPowIn(2));
    }
    event.preventDefault();
  }

  handleDeath = () => {
    createjs.Sound.play(this.popID);
    this.isDead = true;
  }

  handleTick = (event) => {
    // Actions carried out each tick (aka frame)
    //if (!event.paused) {
    //    // Actions carried out when the Ticker is not paused.
    //}
    this.stage.update();
    
    const bubble = this.stage.getChildByName("bubble");
    if (bubble && bubble.y >= this.height && !this.isDead) {
      this.handleDeath();
    }

    for (const child of this.stage.children) {
      switch (child.name) {
        case "cloud":
          let cloud = child;
          if (cloud.getBounds() && cloud.x <= -cloud.getBounds().width) {
            cloud.x = Math.floor(Math.random() * this.width) + this.width; 
            cloud.y = Math.floor(Math.random() * this.height) + 1;  

            const time = Math.floor(Math.random() * 15000) + 7000;
            createjs.Tween.get(cloud)
              .to({x: -cloud.getBounds().width}, time);
          }
          break;
        case "btc":
          let btc = child;
          if (btc.getBounds() && btc.x <= -btc.getBounds().width) {
            btc.x = Math.floor(Math.random() * this.width * 3) + this.width;
            btc.y = Math.floor(Math.random() * this.height) + 1;  

            const time = Math.floor(Math.random() * 15000) + 7000;
            createjs.Tween.get(btc)
              .to({x: -btc.getBounds().width}, time);
          }
        case "spike":
          let spike = child;
          if (spike.getBounds() && spike.x <= -spike.getBounds().width) {
            spike.x = Math.floor(Math.random() * this.width * 2) + this.width;  
            spike.y = Math.floor(Math.random() * this.height);  
  
            const time = Math.floor(Math.random() * 15000) + 7000;
            createjs.Tween.get(spike)
              .to({x: -spike.getBounds().width}, time);
          } else if (!this.isDead) {
            //const intersection = ndgmr.checkRectCollision(bubble,spike);
            //if (intersection) {
            //  this.handleDeath();
            //}
          }
        default:
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