import p5 from 'p5'

export class Symbol {
  constructor({
    p5: p5instance, 
    x: x, 
    y: y, 
    speed: sp,
    size: size,
    canvasHeight: canvasHeight,
    first: isFirst = false,
  }) {
    this.p5 = p5instance;
    this.x = x;
    this.y = y;
    this.originY = y;
    this.size = size;
    this.speed = sp;
    this.switchInterval = this.p5.round(this.p5.random(15, 30));
    this.canvasHeight = canvasHeight;
    this.isFirst = isFirst;
  }
  
  setToRandomSymbol = () => {
    if (this.p5.frameCount % this.switchInterval == 0) {
      this.value = String.fromCharCode(
        0x30A0 + this.p5.round(this.p5.random(0, 96))
      );
    }
  }

  rain = () => {
    this.y += this.speed;
  }

  render = () => {
    if (this.y <= this.canvasHeight) {
      if (this.isFirst) {
        this.p5.fill(180, 255, 180, 255);
      } else {
        this.p5.fill(0, 255, 70, 50);
      }
      this.p5.text(this.value, this.x, this.y);
      this.rain();
      this.setToRandomSymbol();
    } else {
      this.y = 0;
    }
  }
}