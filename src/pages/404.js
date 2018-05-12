import React, { Component } from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../utils/reset.scss';
import style from './404.module.scss';

class Page extends Component {
  render() {
    return (
      <div className={style.root}>
        <Header />
        <TitleAndMetaTags
          title={'Notes - ' + constants.siteName}
          ogUrl={createOgUrl()}
        />
        <div className={style.content}>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <img
            src="https://i.loli.net/2018/03/29/5abcfa2fddb20.png"
            alt="404"
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;
