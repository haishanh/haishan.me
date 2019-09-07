import React, { Component } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import IconHs from './icons/IconHs';

import logoImg from '../assets/logo.svg';

import s0 from './Header.module.css';

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

  state = { logoColor: 'none' };

  handleLogoOnMouseEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    const { logoColorPresets: presets } = this.props;
    this.setState({ logoColor: getRandomEle(presets) });
  };

  render() {
    const { logoColor } = this.state;

    return (
      <header className={s0.masthead}>
        <input
          type="checkbox"
          id="menustate"
          className={s0.menustate}
          style={{ display: 'none' }}
        />
        <div className={s0.wrapper}>
          <div className={s0.logo} onMouseEnter={this.handleLogoOnMouseEnter}>
            <Link to={'/'}>
              <img src={logoImg} alt="logo" />
            </Link>
            <div style={{ color: logoColor }}>
              <IconHs />
            </div>
          </div>
          <label
            className={s0.hamburger}
            aria-hidden="true"
            htmlFor="menustate">
            <div>
              <div />
            </div>
          </label>
        </div>
        <nav className={s0.nav}>
          <ul>
            <li>
              <a href="/posts">Posts</a>
            </li>
            <li>
              <a href="/notes">Notes</a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
