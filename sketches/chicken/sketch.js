import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'

export default function sketch (p5) {
  let canvas;
  
  p5.preload = () => {
    //rocketImage = p5.loadImage('static/rocket.png');
  }

  p5.cleanUp = () => {
    //close = true;
    p5.remove();
  }

  p5.setup = () => {
    var canvasDiv = document.getElementById('sketch');
    var width = canvasDiv.offsetWidth;
    var height = canvasDiv.offsetHeight;
    var sketchCanvas = p5.createCanvas(width,height);
    console.log(sketchCanvas);
    sketchCanvas.parent("sketch");
    //canvas.style.height='100%';
    //// ...then set the internal size to match
    //canvas.width  = canvas.offsetWidth;
    //canvas.height = canvas.offsetHeight;
    //const width = Math.floor(p5.windowWidth);
    //const height = Math.floor(p5.windowHeight); 
    //canvas = p5.createCanvas(width, height);
    //const x = (p5.windowWidth - p5.width) / 2;
    //const y = (p5.windowHeight - p5.height) / 2;
    //canvas.position(x, y);
  }

  p5.windowResized = () => {
    const width = Math.floor(2*p5.windowWidth/3);
    const height = Math.floor(2*p5.windowHeight/3); 
    p5.resizeCanvas(width, height);

    const x = (p5.windowWidth - p5.width) / 2;
    const y = (p5.windowHeight - p5.height) / 2;
    canvas.position(x, y);
  }

  p5.draw = () => {
    p5.background(0);
  }
  
  p5.keyReleased = (event) => {
    return false;
  }
  
  p5.keyPressed = (event) => {
    return false; 
  }
}