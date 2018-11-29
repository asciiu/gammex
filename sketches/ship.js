import p5 from 'p5'

export class Ship {
  constructor(p5instance) {
    this.p5 = p5instance;
    this.pos = p5instance.createVector(p5instance.width/2, p5instance.height/2);
    this.r = 5;
    this.heading = 0;
    this.rotation = 0;
    this.vel = p5instance.createVector(0, 0);
    this.isBoosting = false;
  }
  
  // boost is true or false
  boosting = (boost) => {
    this.isBoosting = boost;
  }
  
  update = () => {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  };
  
  boost = () => {
      let force = p5.Vector.fromAngle(this.heading);
      force.mult(0.1);
      this.vel.add(force);
  };
  
  hits = (asteroid) => {
    let d = this.p5.dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    if (d < this.r + asteroid.r) {
      return true;
    } else {
      return false;
    }
  };
  
  render = () => {
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.heading + this.p5.PI / 2);
    this.p5.fill(0, 255, 0, 100);
    this.p5.stroke(255);
    this.p5.triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    this.p5.pop();
  };
  
  edges = () => {
    if (this.pos.x > this.p5.width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = this.p5.width + this.r;
    }
    if (this.pos.y > this.p5.height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = this.p5.height + this.r;
    }
  }
  
  setRotation = (a) => {
    this.rotation = a;
  }
  
  turn = () => {
    this.heading += this.rotation;
  }
}