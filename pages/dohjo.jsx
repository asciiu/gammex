import Layout  from '../components/layout';
import gql from '../lib/gql';
import redirect from '../lib/redirect';
import React from "react";
import ReactDOM from "react-dom";
import { Row, Col } from 'antd';
import 'script-loader!../scripts/ndgmr.Collision.js';
import { TileMap } from '../sketches/defender/tileMap';
import { Astar } from '../sketches/defender/astar';

export default class Dohjo extends React.Component {
  rects = [];

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

  componentDidMount = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas);
    this.canvas.style.backgroundColor = "#001529";

    //if (this.width > this.height) {
      this.canvas.width = this.width;
      this.canvas.height = this.width;
    //} else {
    //  this.canvas.width = this.height;
    //  this.canvas.height = this.height;
    //}

    this.stage = new createjs.Stage(this.canvas);
    this.stage.addEventListener("stagemousedown", this.handleMouseClick);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    document.onkeydown = this.handleKey;

    // let width = 64 * 0.3;
    // let height = 64 * 0.3;
    //let offset = (this.width - this.height) / 2;
    //let center = Math.floor(unit/2);
    let unit = 31;
    let tileWidth = this.width / unit;

    const tileMap = new TileMap(unit, unit, tileWidth);
    for (let i = 0; i < tileMap.numCols; ++i) {
      for (let j = 0; j < tileMap.numRows; ++j) {
        const tile = tileMap.tiles[i][j];
        const x = tile.col * tileWidth;
        const y = tile.row * tileWidth;

        const rect = new createjs.Shape();
        rect.alpha = 0.1;
        rect.graphics.setStrokeStyle(1);
        if (i == 15 && j == 15) {
          rect.graphics.beginFill('red');
        } else {
          rect.graphics.beginFill('white');
        }
        rect.graphics.drawRect(x, y, tileWidth, tileWidth);
        rect.graphics.endFill();
        tile.setShape(rect);
        //this.rects.push(rect);
        this.stage.addChild(rect);
      }
    }
    this.tileMap = tileMap;

    let coins = []
    for (let i = 0; i < 1; i++) {
      const btc = new createjs.Bitmap("/static/clouds/btc.png");
      btc.scaleX = 0.5;
      btc.scaleY = 0.5;
      //btc.x = Math.floor(Math.random() * this.width);
      //btc.y = Math.floor(Math.random() * this.height);  
      const offset = tileMap.tileSize;
      btc.x = i + offset/2;
      btc.y = i + offset/2;
      btc.regX = tileMap.tileSize;
      btc.regY = tileMap.tileSize;
      btc.name = "btc";
      coins.push(btc);
      this.stage.addChild(btc);
    }

    this.astar = new Astar(tileMap.tiles)
    for (const coin of coins) {
      const tile1 = tileMap.tiles[0][0];
      const target = tileMap.tiles[15][15];
      const path = this.astar.findPath(tile1, target, true, false);
      const tile = path[path.length-1];
      coin.tile = tile;
      const offset = this.tileMap.tileSize;
      
      const x = (tile[0] * offset) + offset/2;
      const y = (tile[1] * offset) + offset/2;
      createjs.Tween.get(coin)
        .to({x: x, y: y}, 700)
        .call(this.handleComplete, [coin], this);
    }
  }

  handleComplete = (coin) => {
    const target = this.tileMap.tiles[15][15];
    const tile = this.tileMap.tiles[coin.tile[0]][coin.tile[1]];
    const path = this.astar.findPath(tile, target, true, false);

    if (path.length > 0) {
      const t = path[path.length-1];
      coin.tile = t;
      const t1 = this.tileMap.tiles[t[0]][t[1]];
      const offset = this.tileMap.tileSize;
      const x = (t1.col * offset) + offset/2;
      const y = (t1.row * offset) + offset/2;
      createjs.Tween.get(coin)
        .to({x: x, y: y}, 300)
        .call(this.handleComplete, [coin], this);
    }
  }
  
  handleKey = (event) => {
    event.preventDefault();
  }

  handleMouseClick = (event) => {
    this.activeTile.shape.alpha = 1.0;
    this.activeTile.setOccupied(true);
  }

  handleTick = (event) => {
    for (const col of this.tileMap.tiles) {
      for (const tile of col) {
        if (tile != this.activeTile) {
          if (tile.shape.alpha < 0.7) 
            tile.shape.alpha = 0.1;
          if (tile.shape.hitTest(this.stage.mouseX, this.stage.mouseY)) {
            this.activeTile = tile;
            tile.shape.alpha = 0.6;
          } 
        }
      }
    }

    // Actions carried out each tick (aka frame)
    //if (!event.paused) {
    //    // Actions carried out when the Ticker is not paused.
    //}
    this.stage.update();
  }

  render() {
    const canvasStyle = {
      width: '100%',
      height: '100%'
    }

    return (
      <Layout {...this.props} title="dohjo">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <canvas ref="canvas" style={canvasStyle}></canvas>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}