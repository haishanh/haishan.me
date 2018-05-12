import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';

import throttle from '../utils/throttle';
import isMobile from '../utils/isMobile';

import '../utils/reset.scss';
import s0 from './index.module.scss';
import jump from 'jump.js';

const svgSprite = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
      <symbol viewBox="0 0 39 32" id="tri">
        <path d="M19.5 0L39 32H0z"/>
      </symbol>
      <symbol viewBox="0 0 48 48" id="arrow-down">
        <path d="M7.988 18.026l16.028 11.879L40.128 17.96"/>
      </symbol>
    </svg>
`;

const colors = ['#faa623', '#1abc9c', '#3498db', '#e74c3c'];
const scolors = ['#755727', '#1f564c', '#305b77', '#8a3c34'];

export default class Index extends React.Component {
  state = { scrollY: 0, x: 0, y: 0 };
  dom = {};
  isMobile = isMobile(window.userAgent || window.navigator.userAgent);

  handleScroll = ev => {
    ev.preventDefault();
    this.setState({ scrollY: window.scrollY });
  };

  handleMouseMove = ev => {
    ev.preventDefault();
    const h = this.dom.hero.clientHeight / 2;
    const w = this.dom.hero.clientWidth / 2;
    this.setState({ x: w - ev.clientX, y: h - ev.clientY });
  };

  handleOrientation = ev => {
    ev.preventDefault();
    this.setState({ x: ev.gamma * 15, y: (ev.beta - 50) * 15 });
  };

  handleArrowOnClick = () => jump('main');

  componentDidMount() {
    if (this.isMobile) {
      window.addEventListener(
        'deviceorientation',
        throttle(this.handleOrientation, 150)
      );
    }
    window.addEventListener('scroll', this.handleScroll);

    // yo
    console.log('<𝙷𝚊𝚒𝚜𝚑𝚊𝚗 /> did mount!!!');
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  render() {
    const rotates = [
      `rotate(${this.state.scrollY * 4 + 134}deg)`,
      `rotate(${this.state.scrollY * 3 + 35}deg)`,
      `rotate(${this.state.scrollY * 3 + 45}deg)`,
      `rotate(${this.state.scrollY * 4 + 75}deg)`
    ];
    const x = this.state.x / 50;
    const y = this.state.y / 50;
    const t = `translate(${x}px, ${y}px)`;
    const r = `rotateX(${(y * 3) % 360}deg) rotateY(${(x * 3) % 360}deg)`;
    let translate1;
    let translate2;
    if (this.isMobile) {
      translate1 = undefined;
      translate2 = t;
    } else {
      translate1 = r;
      translate2 = `${t} ${r}`;
    }
    return (
      <div>
        <TitleAndMetaTags ogUrl={createOgUrl()} title="haishan.me" />
        <div
          dangerouslySetInnerHTML={{ __html: svgSprite }}
          style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
        />
        <div
          className={s0.hero}
          ref={e => (this.dom.hero = e)}
          onMouseMove={this.handleMouseMove}
        >
          <div className={s0.bg} />
          <div className={s0.tries}>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '18%',
                transform: translate1
              }}
            >
              <svg
                style={{
                  fill: scolors[0],
                  transform: rotates[0]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '18%',
                transform: translate2
              }}
            >
              <svg
                style={{
                  fill: colors[0],
                  transform: rotates[0]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '27%',
                left: '52%',
                transform: translate1
              }}
            >
              <svg
                style={{
                  fill: scolors[1],
                  transform: rotates[1]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '27%',
                left: '52%',
                transform: translate2
              }}
            >
              <svg
                style={{
                  fill: colors[1],
                  transform: rotates[1]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '66%',
                left: '30%',
                transform: translate1
              }}
            >
              <svg
                style={{
                  fill: scolors[2],
                  transform: rotates[2]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '66%',
                left: '30%',
                transform: translate2
              }}
            >
              <svg
                style={{
                  fill: colors[2],
                  transform: rotates[2]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '69%',
                transform: translate1
              }}
            >
              <svg
                style={{
                  fill: scolors[3],
                  transform: rotates[3]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '69%',
                transform: translate2
              }}
            >
              <svg
                style={{
                  fill: colors[3],
                  transform: rotates[3]
                }}
              >
                <use xlinkHref="#tri" />
              </svg>
            </div>
          </div>

          <div className={s0.arrow} onClick={this.handleArrowOnClick}>
            <svg>
              <use xlinkHref="#arrow-down" />
            </svg>
          </div>
        </div>
        <main className={s0.main} aria-label="Content">
          <div className={s0.mainWrapper}>
            <nav>
              <ul>
                <li>
                  <a href="/posts">Posts</a>
                </li>
                <li>
                  <a href="/notes">Notes</a>
                </li>
              </ul>
            </nav>
            <div className={s0.social}>
              <a href="https://twitter.com/carlhan" className={s0.twitter}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#aaa"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="https://github.com/haishanh" className={s0.github}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#aaa"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
