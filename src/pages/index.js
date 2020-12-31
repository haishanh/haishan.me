import React from "react";

import { pick, rangeFloor } from "canvas-sketch-util/random";

import TitleAndMetaTags from "../components/TitleAndMetaTags";
import IconGitHub from "../components/icons/IconGitHub";
import IconTwitter from "../components/icons/IconTwitter";

import createOgUrl from "../utils/createOgUrl";
import throttle from "../utils/throttle";
import isMobile from "../utils/isMobile";

import "../utils/reset.css";
import s0 from "./index.module.css";
import jump from "jump.js";

const svgSprite = `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display:none;position: absolute; width: 0; height: 0">
      <symbol viewBox="0 0 39 32" id="tri">
        <path d="M19.5 0L39 32H0z"/>
      </symbol>
      <symbol viewBox="0 0 36 36" id="square">
        <rect width="36" height="36"/>
      </symbol>
      <symbol viewBox="0 0 36 36" id="circle">
        <circle cx="18" cy="18" r="18"/>
      </symbol>
      <symbol viewBox="0 0 48 48" id="arrow-down">
        <path d="M7.988 18.026l16.028 11.879L40.128 17.96"/>
      </symbol>
    </svg>
`;

const allIcons = ["tri", "square", "circle"];
const allColors = [
  { c: "#faa623", s: "#755727" },
  { c: "#1abc9c", s: "#1f564c" },
  { c: "#3498db", s: "#305b77" },
  { c: "#e74c3c", s: "#8a3c34" },
  { c: "#5452F6", s: "#232268" },
  { c: "#c4c4c4", s: "#858585" },
];
const allStyles = [
  { top: "25%", left: "18%" },
  { top: "27%", left: "52%" },
  { top: "66%", left: "30%" },
  { top: "58%", left: "69%" },
  { top: "38%", left: "79%" },
  { top: "32%", left: "57%" },
  { top: "42%", left: "23%" },
  { top: "48%", left: "65%" },
];
const allRotateBases = [35, 45, 55, 65, 75, 85, 105, 125, 135];
const allRotateFactors = [2, 3, 4];
const allScales = [0.8, 0.9, 1, 1.1, 1.2];

const decorations = (function genDecorations(n = 8) {
  const decos = [];
  for (let i = 0; i < n; i++) {
    const rF = pick(allRotateFactors);
    const rB = pick(allRotateBases);
    const scale = pick(allScales);
    const s = allStyles[i];
    decos.push({
      icon: pick(allIcons),
      color: pick(allColors),
      style: { position: "absolute", ...s },
      rotate: (y) => `rotate(${y * rF + rB}deg) scale(${scale})`,
    });
  }
  return decos;
})();

export default class Index extends React.Component {
  state = { scrollY: 0, x: 0, y: 0 };
  dom = {};
  isMobile = false;

  handleScroll = (ev) => {
    ev.preventDefault();
    this.setState({ scrollY: window.scrollY });
  };

  handleMouseMove = (ev) => {
    ev.preventDefault();
    const h = this.dom.hero.clientHeight / 2;
    const w = this.dom.hero.clientWidth / 2;
    this.setState({ x: w - ev.clientX, y: h - ev.clientY });
  };

  handleOrientation = (ev) => {
    ev.preventDefault();
    this.setState({ x: ev.gamma * 15, y: (ev.beta - 50) * 15 });
  };

  handleArrowOnClick = () => jump("main");

  handleOrientation2 = throttle(this.handleOrientation, 150);

  componentDidMount() {
    // FIXME
    // to work around SSR
    this.isMobile = isMobile(window.userAgent || window.navigator.userAgent);
    if (this.isMobile) {
      window.addEventListener("deviceorientation", this.handleOrientation2);
    }
    window.addEventListener("scroll", this.handleScroll);

    // yo
    console.log("<𝙷𝚊𝚒𝚜𝚑𝚊𝚗 /> did mount!!!");
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this.isMobile) {
      window.removeEventListener("deviceorientation", this.handleOrientation2);
    }
  }
  render() {
    const scrollY = this.state.scrollY;
    const x = this.state.x / 50;
    const y = this.state.y / 50;
    const t = `translate(${x}px, ${y}px)`;
    const r = `rotateX(${(y * 3) % 360}deg) rotateY(${(x * 3) % 360}deg)`;
    let t1;
    let t2;
    if (this.isMobile) {
      t1 = undefined;
      t2 = t;
    } else {
      t1 = r;
      t2 = `${t} ${r}`;
    }
    return (
      <div>
        <TitleAndMetaTags ogUrl={createOgUrl()} title="haishan.me" />
        <div dangerouslySetInnerHTML={{ __html: svgSprite }} />
        <div
          className={s0.hero}
          ref={(e) => (this.dom.hero = e)}
          onMouseMove={this.handleMouseMove}
        >
          <div className={s0.bg} />
          <div className={s0.tries}>
            {decorations.map((_v, idx) => {
              const deco = decorations[idx];
              const scolor = deco.color.s;
              const color = deco.color.c;
              const icon = deco.icon;
              const triStyle = deco.style;
              const rotate = deco.rotate(scrollY);
              return (
                <React.Fragment key={idx}>
                  <div style={{ ...triStyle, transform: t1 }}>
                    <svg style={{ fill: scolor, transform: rotate }}>
                      <use xlinkHref={"#" + icon} />
                    </svg>
                  </div>
                  <div style={{ ...triStyle, transform: t2 }}>
                    <svg style={{ fill: color, transform: rotate }}>
                      <use xlinkHref={"#" + icon} />
                    </svg>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className={s0.arrow} onClick={this.handleArrowOnClick}>
            <svg>
              <use xlinkHref="#arrow-down" />
            </svg>
          </div>
        </div>
        <Main />
      </div>
    );
  }
}

function Main() {
  return (
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
  );
}
