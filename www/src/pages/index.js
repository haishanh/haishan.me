import React from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';

import '../utils/reset.scss';
import style from './index.module.scss';
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

export default class Index extends React.Component {
  state = { scrollY: 0 };

  handleScroll = ev => {
    ev.preventDefault();
    this.setState({ scrollY: window.scrollY });
  };
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  render() {
    const tri1Style = {
      transform: `rotate(${this.state.scrollY * 4 + 134}deg)`
    };
    const tri2Style = {
      transform: `rotate(${this.state.scrollY * 2 + 35}deg)`
    };
    const tri3Style = {
      transform: `rotate(${this.state.scrollY + 45}deg)`
    };
    const tri4Style = {
      transform: `rotate(${this.state.scrollY * 3 + 75}deg)`
    };
    return (
      <div>
        <TitleAndMetaTags ogUrl={createOgUrl()} title="haishan.me" />
        <div
          dangerouslySetInnerHTML={{ __html: svgSprite }}
          style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}
        />
        <div className={style.hero}>
          <div className={style.bg} />
          <div className={style.tries}>
            <svg style={tri1Style}>
              <use xlinkHref="#tri" />
            </svg>
            <svg style={tri2Style}>
              <use xlinkHref="#tri" />
            </svg>
            <svg style={tri3Style}>
              <use xlinkHref="#tri" />
            </svg>
            <svg style={tri4Style}>
              <use xlinkHref="#tri" />
            </svg>
          </div>

          <div className={style.arrow} onClick={() => jump('main')}>
            <svg>
              <use xlinkHref="#arrow-down" />
            </svg>
          </div>
        </div>
        <main className={style.main} aria-label="Content">
          <div className={style.mainWrapper}>
            <h1 className={style.pageHeading}>Welcome</h1>
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
          </div>
        </main>
      </div>
    );
  }
}
