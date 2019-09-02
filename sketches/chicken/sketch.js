import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import {Chicken} from './chicken.js'
//import {Symbol} from './symbol.js'
import {Text} from './text.js'
import { Projectile } from './projectile.js';

export default function sketch (p5) {
  let canvas;
  let chickenImage;
  let player;
  let stream;
  let symbol;
  let canvasWidth;
  let canvasHeight;
  let margin = 20;
  let projectiles = [];
  let price, amount;
  
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

    price = new Text({
      p5: p5,
      x: 10,
      y: 200,
      symbolSize: 30,
      text: "2000.00000000",
    });
    amount = new Text({
      p5: p5,
      x: 150,
      y: 200,
      symbolSize: 30,
      text: "0.10000000",
    });

    for (let i = 0; i < 5; ++i) {
      let projectile = new Projectile({
        x: margin, 
        y: 50, 
        speed: 20, 
        size: 10, 
        canvasHeight: canvasHeight, p5: p5});
      projectiles.push(projectile);
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
    projectiles.forEach(projectile => {
      projectile.render();
    })
    price.render();
    amount.render();

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
      for(let i = 0; i < projectiles.length; ++i) {
        let projectile = projectiles[i];
        if (projectile.isReady) {
          const pos = player.getPosition();
          if (player.scale.x < 0) {
            projectile.fire({x: pos.x - player.size, y: pos.y, color: {r: 0, g: 255, b: 70, a: 100}});
          } else {
            projectile.fire({x: pos.x - player.size, y: pos.y, color: {r: 255, g: 0, b: 70, a: 100}});
          }
          break;
        }
      }
    } 
    return false; 
  }
}