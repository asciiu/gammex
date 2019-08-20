import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import {Chicken} from './chicken.js'
import {Symbol} from './symbol.js'
import {Stream} from './stream.js'

export default function sketch (p5) {
  let canvas;
  let chickenImage;
  let player;
  let stream;
  let symbol;
  let canvasWidth;
  let canvasHeight;
  let margin = 20;
  let streams = [];
  
  p5.preload = () => {
    chickenImage = p5.loadImage('static/chicken/chickenWhite.png');
  }

  p5.cleanUp = () => {
    p5.remove();
  }

  p5.setup = () => {
    // setup canvas size based upon sketch div dimensions
    const canvasDiv = document.getElementById('sketch');
    canvasWidth = canvasDiv.offsetWidth;
    canvasHeight = canvasDiv.offsetHeight;
    const sketchCanvas = p5.createCanvas(canvasWidth,canvasHeight);
    sketchCanvas.parent("sketch");

    // player will be represented by a chicken
    const opts = {
      image: chickenImage,
      width: 30,
      height: 30,
      x: margin,
      y: 20,
      p5ptr: p5,
    }
    player = new Chicken(opts); 

    let y = 50;
    const symbolSize = 20;
    //let colums = canvasWidth / symbolSize;
    for (let x = 2; x <= canvasWidth; x += symbolSize) {
      let stream = new Stream({
        p5, p5,
        symbolSize: symbolSize,
        canvasHeight: canvasHeight,
        x: x,
        y: p5.random(-1000, 0),
      });
      stream.generateSymbols();
      streams.push(stream);
    }
    //symbol = new Symbol({
    //  p5: p5, 
    //  x: canvasWidth/2, 
    //  y: 0, 
    //  speed: p5.random(5, 10),
    //  size: symbolSize
    //});
    //symbol.setToRandomSymbol();

    p5.textSize(symbolSize);
  }

  p5.windowResized = () => {
    var canvasDiv = document.getElementById('sketch');
    canvasWidth = canvasDiv.offsetWidth;
    canvasHeight = canvasDiv.offsetHeight;
    p5.resizeCanvas(canvasWidth, canvasHeight);
  }

  p5.draw = () => {
    p5.background("#001529");
    //p5.background(0, 150);
    player.render();
    player.turn();
    player.update();
    player.edges();

    streams.forEach(element => {
      element.render();
    });
    //stream.render();
    //symbol.render();
    //if (symbol.y >= canvasHeight + symbol.size) {
    //  symbol.y = 0;
    //}
    if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      const pos = player.getPosition();
      if (pos.x <= canvasWidth - margin) {
        player.setPosition(pos.x+10, pos.y);
        player.setScale(-1.0, 1.0);
      }
    } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
      const pos = player.getPosition();
      if (pos.x > margin) {
        player.setPosition(pos.x-10, pos.y);
        player.setScale(1.0, 1.0);
      }
    }
  }
  
  p5.keyReleased = (event) => {
    return false;
  }
  
  //p5.keyPressed = (event) => {
  //  if (event.keyCode == p5.RIGHT_ARROW) {
  //    const pos = player.getPosition();
  //    if (pos.x <= canvasWidth - margin) {
  //      player.setPosition(pos.x+10, pos.y);
  //    }

  //    //player.x += 10;
  //    //console.log("right");

  //    //socket.send([{topic: TopicShipRotation, clientID: clientID, radian: 0.1}]);
  //  } else if (event.keyCode == p5.LEFT_ARROW) {
  //    const pos = player.getPosition();
  //    if (pos.x > margin) {
  //      player.setPosition(pos.x-10, pos.y);
  //    }

  //    //console.log("left");
  //    //socket.send([{topic: TopicShipRotation, clientID: clientID, radian: -0.1}]);
  //  } 
  //  return false; 
  //}
}