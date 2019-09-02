import p5 from 'p5'
import {Symbol} from './symbol.js'

export class Text {
  constructor({
    p5: p5instance, 
    symbolSize: size,
    x: x, 
    y: y,
    text: txt,
  }) {
    this.pos = {x: x, y: y};
    this.p5 = p5instance;
    this.symbols = [];
    this.symbolSize = size;
    this.text = txt; 
    this.generateSymbols();
  }

  generateSymbols = () => {
    let y = this.pos.y; 
    let x = this.pos.x;
    const count = this.text.length;

    for (let i = 0; i < count; ++i) {
      //console.log(this.text[i]);
      let symbol = new Symbol({
        p5: this.p5, 
        x: x, 
        y: y, 
        speed: this.speed,
        size: this.symbolSize,
        value: this.text[i],
        //canvasHeight: this.canvasHeight,
        first: false,
      });
      //symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      x += this.symbolSize/4;
    }
  }

  render = () => {
    this.symbols.forEach(symbol => {
      symbol.render();
    });
  }
}