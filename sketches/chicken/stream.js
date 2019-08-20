import p5 from 'p5'
import {Symbol} from './symbol.js'

export class Stream {
  constructor({
    p5: p5instance, 
    symbolSize: size,
    canvasHeight: canvasHeight,
    x: x, 
    y: y,
  }) {
    this.pos = {x: x, y: y};
    this.p5 = p5instance;
    this.symbols = [];
    this.totalSymbols = this.p5.round(this.p5.random(5, 20));
    this.speed = this.p5.random(2, 4);
    this.symbolSize = size;
    this.canvasHeight = canvasHeight;
  }

  generateSymbols = () => {
    let y = this.pos.y; 
    let x = this.pos.x;

    let first = this.p5.round(this.p5.random(0,4)) == 1;
    for (let i = 0; i < this.totalSymbols; ++i) {
      let symbol = new Symbol({
        p5: this.p5, 
        x: x, 
        y: y, 
        speed: this.speed,
        size: this.symbolSize,
        canvasHeight: this.canvasHeight,
        first: first,
      });
      first = false;
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      y -= this.symbolSize;
    }
  }

  render = () => {
    this.symbols.forEach(function(symbol) {
      symbol.render();
    });
  }
}