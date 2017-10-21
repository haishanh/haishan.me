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
            <div className={style.social}>
              <a href="https://twitter.com/carlhan" className={style.twitter}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M46.685 11.688a17.715 17.715 0 0 1-5.068 1.385 8.813 8.813 0 0 0 3.875-4.877 17.689 17.689 0 0 1-5.6 2.14 8.82 8.82 0 0 0-6.441-2.78c-4.87 0-8.821 3.947-8.821 8.81 0 .692.077 1.365.23 2.005-7.331-.365-13.83-3.876-18.18-9.207a8.775 8.775 0 0 0-1.192 4.428 8.794 8.794 0 0 0 3.926 7.33 8.81 8.81 0 0 1-3.997-1.102v.108c0 4.268 3.04 7.83 7.076 8.638a8.854 8.854 0 0 1-3.984.147 8.831 8.831 0 0 0 8.237 6.12 17.706 17.706 0 0 1-10.957 3.773c-.712 0-1.411-.045-2.104-.121a24.985 24.985 0 0 0 13.523 3.96c16.223 0 25.095-13.424 25.095-25.067 0-.384-.006-.762-.025-1.14a17.83 17.83 0 0 0 4.4-4.562l.007.012z"
                    id="twitter-logo"
                    stroke="#aaa"
                    fill="none"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://github.com/haishanh" className={style.github}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    id="github-logo"
                    d="M23.884 3C11.8 3 2 12.786 2 24.859c0 9.657 6.27 17.85 14.966 20.741 1.094.202 1.495-.474 1.495-1.052 0-.52-.02-2.243-.03-4.07-6.088 1.323-7.373-2.578-7.373-2.578-.995-2.527-2.43-3.198-2.43-3.198-1.985-1.357.15-1.33.15-1.33 2.198.155 3.355 2.253 3.355 2.253 1.952 3.342 5.12 2.376 6.368 1.817.197-1.412.764-2.377 1.39-2.923-4.861-.552-9.97-2.427-9.97-10.802 0-2.387.854-4.337 2.254-5.867-.227-.55-.976-2.774.212-5.785 0 0 1.838-.587 6.02 2.24a21 21 0 0 1 5.477-.735c1.86.009 3.734.251 5.483.736 4.177-2.828 6.012-2.24 6.012-2.24 1.191 3.01.442 5.233.214 5.784 1.404 1.53 2.253 3.48 2.253 5.867 0 8.395-5.12 10.244-9.993 10.785.785.678 1.484 2.009 1.484 4.048 0 2.925-.025 5.279-.025 5.998 0 .582.394 1.264 1.503 1.05 8.69-2.894 14.953-11.085 14.953-20.74C45.768 12.787 35.97 3 23.884 3zM10.196 34.138c-.048.109-.219.141-.375.067-.158-.072-.248-.22-.196-.329.047-.112.218-.143.377-.068.159.071.25.221.194.33zm1.077.96c-.104.096-.309.051-.447-.102-.143-.152-.17-.356-.064-.454.108-.097.305-.051.449.101.143.154.171.357.062.454zm.738 1.227c-.134.093-.353.006-.489-.189-.134-.194-.134-.427.003-.52.136-.094.352-.01.49.183.133.197.133.43-.004.526zm1.25 1.421c-.12.133-.376.097-.563-.083-.191-.176-.245-.427-.124-.559.121-.132.378-.095.566.084.19.176.248.428.12.558zm1.613.48c-.052.172-.298.25-.546.177-.248-.075-.41-.276-.36-.449.052-.172.299-.253.548-.175.248.074.41.273.358.447zm1.837.204c.007.18-.204.33-.464.333-.261.006-.473-.14-.476-.318 0-.182.206-.33.467-.334.26-.005.473.14.473.319zm1.805-.07c.031.177-.15.357-.408.405-.254.047-.49-.062-.521-.236-.032-.18.152-.361.406-.408.259-.045.49.061.523.24z"
                    stroke="#aaa"
                    fill="none"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
