import React from 'react';

const cyb = require('../../image/logo-cyb-v2.svg');
const cyber = require('../../image/cyber.png');

export class Electricity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      d: 'M0,100,500,100'
    };
    this.run();
  }

  update = () => {
    const d = this.calculate(0, 0, 500, 80);
    this.setState({
      d
    });
  };

  calculate = (x, y, width, height) => {
    const points = [[x, height / 0.8]];
    const maxPoints = 10;
    const chunkRange = width / maxPoints;
    for (let i = 0; i < maxPoints; i++) {
      const cx = chunkRange * i + Math.cos(i) * chunkRange;
      const cy = (Math.random() * height) / 0.8;
      points.push([cx, cy]);
    }

    points.push([width, height / 0.8]);

    const d = points.map(point => point.join(','));
    return `M${d.join(',')}`;
  };

  run() {
    const fps = 30;
    let now;
    let delta;
    let then = Date.now();
    const interval = 1000 / fps;
    let iteration = 0;
    const loop = () => {
      requestAnimationFrame(loop);

      now = Date.now();
      delta = now - then;
      if (delta > interval) {
        then = now - (delta % interval);

        // update stuff
        this.update(iteration++);
      }
    };
    loop();
  }

  render() {
    const { d } = this.state;

    return (
      <div className="electricity">
        <img style={{ width: 100, height: 100 }} src={cyber} />
        <div className="line">
          <svg
            className="electricity-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 200"
          >
            <defs>
              <filter id="f1" x="0" y="0">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
              </filter>
            </defs>
            <g>
              <path d={d} fill="none" stroke="#3ab793" filter="url(#f1)" />
              <path d={d} fill="none" stroke="#3ab793" />
            </g>
          </svg>
        </div>
        <img style={{ width: 100, height: 100 }} src={cyb} />
      </div>
    );
  }
}