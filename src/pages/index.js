import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import IconGitHub from '../components/icons/IconGitHub';
import IconTwitter from '../components/icons/IconTwitter';

import createOgUrl from '../utils/createOgUrl';
import throttle from '../utils/throttle';
import isMobile from '../utils/isMobile';

import '../utils/reset.css';
import s0 from './index.module.css';
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
  isMobile = false;

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
    // FIXME
    // to work around SSR
    this.isMobile = isMobile(window.userAgent || window.navigator.userAgent);
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
          onMouseMove={this.handleMouseMove}>
          <div className={s0.bg} />
          <div className={s0.tries}>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '18%',
                transform: translate1
              }}>
              <svg
                style={{
                  fill: scolors[0],
                  transform: rotates[0]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '18%',
                transform: translate2
              }}>
              <svg
                style={{
                  fill: colors[0],
                  transform: rotates[0]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '27%',
                left: '52%',
                transform: translate1
              }}>
              <svg
                style={{
                  fill: scolors[1],
                  transform: rotates[1]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '27%',
                left: '52%',
                transform: translate2
              }}>
              <svg
                style={{
                  fill: colors[1],
                  transform: rotates[1]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '66%',
                left: '30%',
                transform: translate1
              }}>
              <svg
                style={{
                  fill: scolors[2],
                  transform: rotates[2]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '66%',
                left: '30%',
                transform: translate2
              }}>
              <svg
                style={{
                  fill: colors[2],
                  transform: rotates[2]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>

            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '69%',
                transform: translate1
              }}>
              <svg
                style={{
                  fill: scolors[3],
                  transform: rotates[3]
                }}>
                <use xlinkHref="#tri" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '58%',
                left: '69%',
                transform: translate2
              }}>
              <svg
                style={{
                  fill: colors[3],
                  transform: rotates[3]
                }}>
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
                <IconTwitter />
              </a>
              <a href="https://github.com/haishanh" className={s0.github}>
                <IconGitHub />
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
