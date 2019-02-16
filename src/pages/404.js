import React, { Component } from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';

import Header from '../components/Header';
import Footer from '../components/Footer';
import IconZanyFace from '../components/IconZanyFace';

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
          <IconZanyFace width={400} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;
