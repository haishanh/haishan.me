import React, { Component } from 'react';
import cx from 'classnames';
import Link from 'gatsby-link';
import PropTypes from 'prop-types';

import logoImg from '../assets/logo.svg';

import style from './Header.module.scss';

/**
 * get random integer, [min, max)
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomEle(arr) {
  return arr[getRandomInt(0, arr.length)];
}

class Header extends Component {
  static defaultProps = {
    logoColorPresets: ['red', '#ff00ed', '#0097ff', '#74c34a', '#ff8000']
  };
  static propTypes = {
    logoColorPresets: PropTypes.arrayOf(PropTypes.string),
    hero: PropTypes.shape({
      image: PropTypes.string,
      height: PropTypes.string,
      size: PropTypes.string,
      position: PropTypes.string,
      color: PropTypes.string
    })
  };
  constructor(props) {
    super(props);

    this.state = {
      isMenuToggled: false,
      logoColor: 'none'
    };
    this.handleHamburgerOnClick = this.handleHamburgerOnClick.bind(this);
  }

  handleLogoOnMouseEnter = e => {
    // return;
    e.preventDefault();
    e.stopPropagation();
    const { logoColorPresets: presets } = this.props;
    this.setState({ logoColor: getRandomEle(presets) });
  };

  handleHamburgerOnClick(e) {
    e.preventDefault();
    this.setState({ isMenuToggled: !this.state.isMenuToggled });
  }
  render() {
    const { wrapper, logo, menustate, hamburger, nav, toggle } = style;
    const { hero } = this.props;
    const { isMenuToggled, logoColor } = this.state;
    const hamburgerClassNames = cx(hamburger, { [toggle]: isMenuToggled });

    let headerStyle = {};
    if (hero) {
      const bgSize = hero.size || 'cover';
      const bgHeight = hero.height || '450px';
      const bgPosition = hero.position || 'center';
      const bgRepeat = hero.repeat || 'no-repeat';
      const bgColor = hero.color ? hero.color : false;
      const bgImg = hero.image ? `url(${hero.image})` : false;
      headerStyle = {
        height: bgHeight,
        backgroundImage: bgImg,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundRepeat: bgRepeat,
        backgroundColor: bgColor
      };
    }
    return (
      <header style={headerStyle}>
        <input
          type="checkbox"
          id="menustate"
          className={menustate}
          style={{ display: 'none' }}
        />
        <div className={wrapper}>
          <div className={logo} onMouseEnter={this.handleLogoOnMouseEnter}>
            <Link to={'/'}>
              <img src={logoImg} alt="logo" />
            </Link>
            <div>
              <svg
                width="128"
                height="128"
                viewBox="0 0 128 128"
                xmlns="http://www.w3.org/2000/svg"
                fill={logoColor}
              >
                <path d="M28.2 43.7C17.2 54.7 2 66.4 2 79.2c0 13 6 22 31 23.3 24.8 1 30 12.3 51 12.3 20.6 0 42-15 42-41.2 0-21-11.8-28.5-20.2-39-8.4-10.3-18-21.6-38-21.6S39.5 32.8 28.3 43.7z" />
              </svg>
            </div>
          </div>
          <label
            className={hamburgerClassNames}
            aria-hidden="true"
            htmlFor="menustate"
          >
            <div />
          </label>
        </div>
        <nav role="navigation" className={nav}>
          <ul>
            <li>
              <a href="/archives">Archives</a>
            </li>
            <li>
              <a href="/atom.xml">RSS</a>
            </li>
            <li>
              <a href="https://github.com/haishanh/hexo-theme-zxcvb">GitHub</a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
