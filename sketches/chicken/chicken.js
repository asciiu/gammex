import p5 from 'p5'

export class Chicken {
  constructor({
    p5ptr: p5instance, 
    image: img, 
    width: w,
    height: h,
    x: x, 
    y:y, 
    velocityX: vx = 0,
    velocityY: vy = 0,
    radius: rad = 6,
    rotation: radian = 0,
    heading: heading = 0,
    active = false
  }) {
    this.p5 = p5instance;
    this.pos = p5instance.createVector(x, y);

    this.radius = rad;
    this.heading = heading;
    this.rotation = radian;
    this.active = active;

    this.vel = p5instance.createVector(vx, vy);
    this.isBoosting = false;
    this.isDestroyed = false;
    this.player = {
      width: w,
      height: h,
      image: img
    }
    this.color = {
      red: 0,
      green: 200,
      blue: 0,
      alpha: 200,
    }
    this.particles = [];
  }
  
  destroy = () => {
    this.isDestroyed = true;
    this.isBoosting = false;
    let color = {
      r: 200,
      g: 0,
      b: 0,
      a: 150 
    }
  }

  destroyed = () => {
    return this.isDestroyed;
  }

  update = () => {
    if (this.isBoosting) {
      this.boost();
    } 
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }
  
  // boost is true or false
  boosting = (boost) => {
    this.isBoosting = boost;
  }

  boost = () => {
      let force = p5.Vector.fromAngle(this.heading);
      force.mult(0.1);
      this.vel.add(force);

      for (let i = 0; i < 5; ++i) {
        this.particles.push(new Particle({
          p6: this.p5, 
          radius: 3, 
          velocityX: this.p5.random(-0.2, 0.2), 
          velocityY: 1 
        }));
      }
  }
  
  render = () => {
    if (!this.isDestroyed) {
      this.p5.push();
      this.p5.translate(this.pos.x, this.pos.y);
      //this.p5.rotate(this.heading + this.p5.PI / 2);

      this.p5.image(this.player.image, 
        -this.player.width/2, 
        -this.player.height/2, 
        this.player.width, 
        this.player.height);

      this.p5.pop();
    } 
  }
  
  edges = () => {
    if (this.pos.x > this.p5.width + this.radius) {
      this.pos.x = -this.radius;
    } else if (this.pos.x < -this.radius) {
      this.pos.x = this.p5.width + this.radius;
    }
    if (this.pos.y > this.p5.height + this.radius) {
      this.pos.y = -this.radius;
    } else if (this.pos.y < -this.radius) {
      this.pos.y = this.p5.height + this.radius;
    }
  }
  
  setPosition = (x, y) => {
    this.pos.x = x;
    this.pos.y = y;
  }

  setRotation = (radian) => {
    this.rotation = radian;
  }
  
  turn = () => {
    this.heading += this.rotation;
  }
}