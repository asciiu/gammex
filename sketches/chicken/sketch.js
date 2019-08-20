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
  
  p5.preload = () => {
    chickenImage = p5.loadImage('static/chicken/chicken.png');
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
      x: 100,
      y: 15,
      p5ptr: p5,
    }
    player = new Chicken(opts); 

    const symbolSize = 30;
    stream = new Stream({
      p5, p5,
      symbolSize: symbolSize,
      canvasHeight: canvasHeight,
    });
    stream.generateSymbols();
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
    player.render();
    player.turn();
    player.update();
    player.edges();

    stream.render();
    //symbol.render();
    //if (symbol.y >= canvasHeight + symbol.size) {
    //  symbol.y = 0;
    //}
  }
  
  p5.keyReleased = (event) => {
    return false;
  }
  
  p5.keyPressed = (event) => {
    if (event.keyCode == p5.RIGHT_ARROW) {
      console.log("right");
      //socket.send([{topic: TopicShipRotation, clientID: clientID, radian: 0.1}]);
    } else if (event.keyCode == p5.LEFT_ARROW) {
      console.log("left");
      //socket.send([{topic: TopicShipRotation, clientID: clientID, radian: -0.1}]);
    } 
    return false; 
  }
}