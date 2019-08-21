import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import {Chicken} from './chicken.js'
import {Symbol} from './symbol.js'
import {Stream} from './stream.js'
import { Egg } from './egg.js';

export default function sketch (p5) {
  let canvas;
  let chickenImage;
  let player;
  let stream;
  let symbol;
  let canvasWidth;
  let canvasHeight;
  let margin = 20;
  let eggs = [];
  
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
    let size = 30;
    const opts = {
      image: chickenImage,
      width: size,
      height: size,
      x: canvasWidth - size,
      y: canvasHeight/2,
      p5ptr: p5,
      size: size,
    }
    player = new Chicken(opts); 

    for (let i = 0; i < 5; ++i) {
      let egg = new Egg({
        x: margin, 
        y: 50, 
        speed: 10, 
        size: 10, 
        canvasHeight: canvasHeight, p5: p5});
      eggs.push(egg);
    }
    //p5.textSize(symbolSize);
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
    eggs.forEach(egg => {
      egg.render();
    })

    if (p5.keyIsDown(p5.UP_ARROW)) {
      const pos = player.getPosition();
      if (pos.y >= player.size) {
        player.setPosition(pos.x, pos.y-10);
        //player.setScale(-1.0, 1.0);
      }
    } else if (p5.keyIsDown(p5.DOWN_ARROW)) {
      const pos = player.getPosition();
      if (pos.y < canvasHeight - player.size) {
        player.setPosition(pos.x, pos.y+10);
        //player.setScale(1.0, 1.0);
      }
    }
  }
  
  p5.keyReleased = (event) => {
    return false;
  }
  
  p5.keyPressed = (event) => {
    if (event.keyCode == 32) {
      for(let i = 0; i < eggs.length; ++i) {
        let egg = eggs[i];
        if (egg.isReady) {
          const pos = player.getPosition();
          if (player.scale.x < 0) {
            egg.drop({x: pos.x, y: pos.y + player.size, color: {r: 0, g: 255, b: 70, a: 100}});
          } else {
            egg.drop({x: pos.x, y: pos.y + player.size, color: {r: 255, g: 0, b: 70, a: 100}});
          }
          //console.log("egg");
          break;
        }
      }
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
  //    //socket.send([{topic: TopicShipRotation, clientID: clientID, radian: -0.1}]);
    } 
    return false; 
  }
}