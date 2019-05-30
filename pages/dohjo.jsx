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
  tileMap;
  coins = [];
  shit = [];
  forks = [];

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
    this.canvas.width = this.width;
    this.canvas.height = this.width;

    this.stage = new createjs.Stage(this.canvas);
    this.stage.addEventListener("stagemousedown", this.handleMouseClick);
    createjs.Ticker.addEventListener("tick", this.handleTick);
    document.onkeydown = this.handleKey;

    let unit = 31;
    let tileWidth = this.width / unit;

    const targetX = 15;
    const targetY = 15;

    const tileMap = new TileMap(unit, unit, tileWidth);
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

    for (let i = 0; i < 1; i++) {
      const offset = this.tileMap.tileSize;
      const btc = new createjs.Bitmap("/static/clouds/btc.png");
      btc.scaleX = 0.5;
      btc.scaleY = 0.5;
      btc.regX = this.tileMap.tileSize;
      btc.regY = this.tileMap.tileSize;
      btc.name = "btc";

      this.coins.push(btc);
      this.stage.addChild(btc);
    }

    for (let i = 0; i < 5; i++) {
      const offset = this.tileMap.tileSize;
      const shit = new createjs.Bitmap("/static/clouds/fork.png");
      shit.scaleX = 0.5;
      shit.scaleY = 0.5;
      shit.regX = this.tileMap.tileSize;
      shit.regY = this.tileMap.tileSize;
      shit.name = "fork";

      this.coins.push(shit);
      this.stage.addChild(shit);
    }

    for (let i = 0; i < 10; i++) {
      const offset = this.tileMap.tileSize;
      const fork = new createjs.Bitmap("/static/clouds/shit.png");
      fork.scaleX = 0.4;
      fork.scaleY = 0.4;
      fork.regX = this.tileMap.tileSize;
      fork.regY = this.tileMap.tileSize;
      fork.name = "shit";

      this.coins.push(fork);
      this.stage.addChild(fork);
    }

    this.astar = new Astar(tileMap.tiles)
    for (const coin of this.coins) {
      const pause = Math.floor(Math.random() * 5000) + 1000

      if (coin.name == "btc") 
        setTimeout(this.startCoin(coin, 1500), pause);
      if (coin.name == "shit")
        setTimeout(this.startCoin(coin, 300), pause);
      if (coin.name == "fork")
        setTimeout(this.startCoin(coin, 700), pause);
    }
  }

  randomTile = () => {
    const sides = ["top", "bottom", "right", "left"];
    const side = sides[Math.floor(Math.random() * sides.length)];
    if (side == "top") {
      const xs = Math.floor(Math.random() * this.tileMap.numCols);
      return {x1: xs, y1: -1, x2: xs, y2: 0}; 
    } else if (side == "bottom") {
      const xs = Math.floor(Math.random() * this.tileMap.numCols);
      const ys = this.tileMap.numCols;
      return {x1: xs, y1: ys, x2: xs, y2: ys-1}; 
    } else if (side == "right") {
      const xs = this.tileMap.numCols;
      const ys = Math.floor(Math.random() * this.tileMap.numRows);
      return {x1: xs, y1: ys, x2: xs-1, y2: ys}; 
    } else if (side == "left") {
      const ys = Math.floor(Math.random() * this.tileMap.numRows);
      return {x1: -1, y1: ys, x2: 0, y2: ys}; 
    }
  }

  startCoin = (coin, speed) => {
    const coords = this.randomTile();
    const offset = this.tileMap.tileSize;
    const x2 = (coords.x2 * offset) + offset/2;
    const y2= (coords.y2 * offset) + offset/2;

    coin.tile = [coords.x2, coords.y2];
    coin.x = (coords.x1 * offset) + offset/2;
    coin.y = (coords.y1 * offset) + offset/2;
    createjs.Tween.get(coin)
      .to({x: x2, y: y2}, 300)
      .call(this.handleComplete, [coin, speed], this);
  }

  handleComplete = (coin, speed) => {
    const tile = this.tileMap.tiles[coin.tile[0]][coin.tile[1]];
    const path = this.astar.findPath(tile, this.targetTile, true, false);

    if (path.length > 0) {
      const t = path[path.length-1];
      coin.tile = t;
      const t1 = this.tileMap.tiles[t[0]][t[1]];
      const offset = this.tileMap.tileSize;
      const x = (t1.col * offset) + offset/2;
      const y = (t1.row * offset) + offset/2;
      createjs.Tween.get(coin)
        .to({x: x, y: y}, speed) 
        .call(this.handleComplete, [coin, speed], this);
    } else {
      this.startCoin(coin, speed);
    }
  }
  
  handleKey = (event) => {
    event.preventDefault();
  }
  
  handleMouseClick = (event) => {
    for (const col of this.tileMap.tiles) {
      for (const tile of col) {
        if (tile.shape.hitTest(this.stage.mouseX, this.stage.mouseY) && 
            tile.col > 0 && tile.row > 0 && 
            tile.col < this.tileMap.numCols - 1 &&
            tile.row < this.tileMap.numRows - 1 ) {
          if (tile.isBlocked) {
            tile.shape.alpha = 0.1;
            tile.setBlocked(false);
          } else if (tile != this.targetTile) {
            tile.shape.alpha = 1.0;
            tile.setBlocked(true);

            // can't block path
            const path = this.astar.findPath(this.tileMap.tiles[0][0], this.targetTile, true, false);
            if (path.length == 0) {
              tile.shape.alpha = 0.1;
              tile.setBlocked(false);
            }
          } 
        } 
      }
    }
  }

  handleTick = (event) => {
    for (const col of this.tileMap.tiles) {
      for (const tile of col) {
        if (!tile.isBlocked) {
          if (tile.shape.alpha > 0.1) {
            // reset alpha
            tile.shape.alpha = 0.1;
          }
          if (tile.shape.hitTest(this.stage.mouseX, this.stage.mouseY) &&
              tile.col > 0 && tile.row > 0 && 
              tile.col < this.tileMap.numCols - 1 &&
              tile.row < this.tileMap.numRows - 1) {
            // highlight tile if mouse pointer is on tile
            tile.shape.alpha = 0.3;
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