export class Projectile {
  constructor({
    p5: p5instance, 
    x: x, 
    y: y, 
    speed: sp,
    size: size,
    canvasHeight: canvasHeight,
  }) {
    this.p5 = p5instance;
    this.x = x;
    this.y = y;
    this.originY = y;
    this.size = size;
    this.speed = sp;
    this.canvasHeight = canvasHeight;
    this.isReady = true;
    this.color = {r: 0, g: 255, b: 70, a: 100};
  }

  move = () => {
    this.x -= this.speed;
    if (this.x < - this.size) {
      this.isReady = true;
    }
  }

  fire = ({x: xPos, y: yPos, color: color}) => {
    this.isReady = false;
    this.x = xPos;
    this.y = yPos;
    this.color = color;
  }

  render = () => {
    if (this.y <= this.canvasHeight) {
      this.p5.fill(this.color.r, this.color.g, this.color.b, this.color.a);
      // An ellipse
      this.p5.ellipse(this.x, this.y, 30, 30);
      this.move();
    } 
  }

  setColor = ({red: r, green: g, blue: b, alpha: a}) => {
    this.color.r = r;
    this.color.g = g;
    this.color.b = b;
    this.color.a = a;
  }
}