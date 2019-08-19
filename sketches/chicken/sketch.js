import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import {Chicken} from './chicken.js'

export default function sketch (p5) {
  let canvas;
  let chickenImage;
  let player;
  
  p5.preload = () => {
    chickenImage = p5.loadImage('static/chicken/chicken.png');
  }

  p5.cleanUp = () => {
    p5.remove();
  }

  p5.setup = () => {
    var canvasDiv = document.getElementById('sketch');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var sketchCanvas = p5.createCanvas(width,height);
    sketchCanvas.parent("sketch");

    const opts = {
      image: chickenImage,
      width: 30,
      height: 30,
      x: 100,
      y: 15,
      p5ptr: p5,
    }
    player = new Chicken(opts); 
  }

  p5.windowResized = () => {
    var canvasDiv = document.getElementById('sketch');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    p5.resizeCanvas(width, height);
  }

  p5.draw = () => {
    p5.background("#001529");
    player.render();
    player.turn();
    player.update();
    player.edges();
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