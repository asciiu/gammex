import Layout from '../components/layout';
import checkLoggedIn from '../lib/checkLoggedIn';
import redirect from '../lib/redirect';
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd';
import 'script-loader!../scripts/ndgmr.Collision.js';

const POP_SOUND = "pop";
const BUBBLE_SOUND = "bubble";
const MONEY_SOUND = "money";

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

  constructor(props) {
    super(props);
    this.btc = null;
    this.bubble = null;
    this.canvas = null;
    this.isDead = false;
  }

  handleComplete = () => {
    createjs.Sound.registerSound("static/clouds/bubble.mp3", BUBBLE_SOUND);
    createjs.Sound.registerSound("static/clouds/pop.mp3", POP_SOUND);
    createjs.Sound.registerSound("static/money.mp3", MONEY_SOUND);

    for (let i = 0; i < 10; i++) {
      const spike = new createjs.Bitmap("/static/clouds/spike.png");
      spike.scaleX = 0.1;
      spike.scaleY = 0.1;
      spike.x = -this.width;
      spike.name = "spike";
      this.stage.addChild(spike);
    }

    for (let i = 0; i < 3; i++) {
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

    let clouds = [];
    for (let i = 1; i < 3; i++) {
      clouds.push(new createjs.Bitmap("/static/clouds/cloud1.png"));
      clouds.push(new createjs.Bitmap("/static/clouds/cloud2.png"));
      clouds.push(new createjs.Bitmap("/static/clouds/cloud3.png"));
      clouds.push(new createjs.Bitmap("/static/clouds/cloud4.png"));
    }

    for (const cloud of clouds) {
      cloud.name = "cloud";
      // init off screen
      cloud.x = -this.width;
      this.stage.addChild(cloud);
    }
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
    queue.loadFile("/static/money.mp3");
    queue.load();
  }
  
  handleKey = (event) => {
    if (event.keyCode == 32) {
      // to be removed, need to implement game over and restart
      if (this.bubble.y < this.height && this.isDead) {
        this.isDead = false;
      }
      createjs.Sound.play(BUBBLE_SOUND);
      createjs.Tween.get(this.bubble)
        .to({y: this.bubble.y-50}, 300, createjs.Ease.getPowOut(2))
        .to({y: this.bubble.y+1000}, 7000, createjs.Ease.getPowIn(2));
    }
    event.preventDefault();
  }

  handleDeath = () => {
    createjs.Sound.play(POP_SOUND);
    this.isDead = true;
  }

  handleBtc = (btc) => {
    if (this.btc != btc) {
      this.btc = btc;
      createjs.Sound.play(MONEY_SOUND);
    }
  }

  handleTick = (event) => {
    // Actions carried out each tick (aka frame)
    //if (!event.paused) {
    //    // Actions carried out when the Ticker is not paused.
    //}
    this.stage.update();
    
    if (this.bubble && this.bubble.y >= this.height && !this.isDead) {
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

            const time = Math.floor(Math.random() * 15000) + 10000;
            createjs.Tween.get(btc)
              .to({x: -btc.getBounds().width}, time);
          } else if (ndgmr) {
            const intersection = ndgmr.checkRectCollision(this.bubble, btc);
            if (intersection && this.btc != btc) {
              this.handleBtc(btc);
            } 
          }
          break;
        case "spike":
          let spike = child;
          if (spike.getBounds() && spike.x <= -spike.getBounds().width) {
            spike.x = Math.floor(Math.random() * this.width * 2) + this.width;  
            spike.y = Math.floor(Math.random() * this.height);  
  
            const time = Math.floor(Math.random() * 10000) + 15000;
            createjs.Tween.get(spike)
              .to({x: -spike.getBounds().width}, time);
          } else if (!this.isDead && ndgmr) {
            const collision = ndgmr.checkRectCollision(this.bubble, spike);
            if (collision) {
              this.handleDeath();
            }
          }
          break;
        default:
      }
    }
  }

  render() {
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