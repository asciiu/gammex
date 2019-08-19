import Layout  from '../components/layout';
import gql from '../lib/gql';
import redirect from '../lib/redirect';
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd';
import 'script-loader!../scripts/ndgmr.Collision.js';
import { TileMap } from '../sketches/defender/tileMap';

export default class Chicken extends React.Component {
  tileMap;

  static async getInitialProps (context) {
    const { summary } = await gql.CheckLoggedIn(context.apolloClient);
    if (!summary.userSummary) {
      // Not signed in.
      // Throw them back to the main page
      redirect(context, '/');
    }

    return { summary: summary }
  }

  constructor(props) {
    super(props);
    this.canvas = null;
    window.onblur = this.onblur;
    window.onfocus = this.onfocus;
  }

  componentWillUnmount() {
    // TODO need to release mem gracefully
    document.onkeydown = null;
    this.stage.clear();
    this.stage.enableDOMEvents(false);
    this.canvas.remove();
    createjs.Ticker.removeEventListener("tick", this.handleTick);
    document.onkeydown = null;
  }

  onblur = () => {
    createjs.Ticker.paused = true;
    console.log('blur');
  }

  onfocus = () => {
    createjs.Ticker.paused = false;
    console.log('focus');
  }

  componentDidMount = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvas.style.backgroundColor = "#001529";
    //this.canvas.width = this.width;
    //this.canvas.height = this.width;

    this.stage = new createjs.Stage(this.canvas);
    this.stage.addEventListener("stagemousedown", this.handleMouseClick);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    document.onkeydown = this.handleKey;

    let unit = 31;
    let tileWidth = this.width / unit;

    const targetX = 15;
    const targetY = 15;

    const tileMap = new TileMap(unit, unit, tileWidth);

    this.redTile = new createjs.Shape();
    this.redTile.graphics.beginFill('red');
    this.redTile.alpha = 0.0;
    this.redTile.graphics.drawRect(0, 0, tileWidth, tileWidth);
    this.stage.addChild(this.redTile);

    for (let i = 0; i < tileMap.numCols; ++i) {
      for (let j = 0; j < tileMap.numRows; ++j) {
        const tile = tileMap.tiles[i][j];
        const x = tile.col * tileWidth;
        const y = tile.row * tileWidth;

        const rect = new createjs.Shape();
        rect.graphics.setStrokeStyle(1);
        if (i == targetX && j == targetY) {
          this.targetTile = tile;
          rect.graphics.beginFill('red');
          rect.alpha = 0.7;
        } else {
          rect.graphics.beginFill('white');
          rect.alpha = 0.1;
        }
        
        rect.graphics.drawRect(x, y, tileWidth, tileWidth);
        tile.setShape(rect);
        this.stage.addChild(rect);
      }
    }
    this.tileMap = tileMap;
  }
  
  handleKey = (event) => {
    event.preventDefault();
  }
  
  handleMouseClick = (event) => {
  }

  handleTick = (event) => {
    this.stage.update();
  }

  render() {
    const canvasStyle = {
      width: '100%',
      height: '100%'
    };

    return (
      <Layout {...this.props} title="chicken">
        <Row>
          <Col span={0}></Col>
          <Col span={20}>
            <canvas ref="canvas" style={canvasStyle}></canvas>
          </Col>
          <Col span={4}></Col>
        </Row>
      </Layout>
    );
  }
}