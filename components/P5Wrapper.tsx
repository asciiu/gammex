import React from 'react';
import p5 from 'p5';


interface P5Props {
  sketch: any;
}

// Original source: https://discuss.reactjs.org/t/using-react-with-p5-js/5565/2
export default class P5Wrapper extends React.Component<P5Props, any> {
  canvas: any;
  wrapper: any;

  componentDidMount() {
    this.canvas = new p5(this.props.sketch, this.wrapper);
    if( this.canvas.myCustomRedrawAccordingToNewPropsHandler ) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(this.props);
    }
  }

  componentWillReceiveProps(newprops) {
    if(this.props.sketch !== newprops.sketch){
      this.canvas.remove();
      this.canvas = new p5(newprops.sketch, this.wrapper);
    }
    if( this.canvas.myCustomRedrawAccordingToNewPropsHandler ) {
      this.canvas.myCustomRedrawAccordingToNewPropsHandler(newprops);
    }
  }

  componentWillUnmount() {
    if (this.canvas && this.canvas.cleanUp) this.canvas.cleanUp();
  }

  render() {
    return <div ref={wrapper => this.wrapper = wrapper}></div>;
  }
}
