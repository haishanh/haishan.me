import React, { Component } from 'react';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';

import Header from '../components/Header';
import Footer from '../components/Footer';
import IconZanyFace from '../components/IconZanyFace';

import '../utils/reset.css';
import style from './404.module.css';

class Page extends Component {
  render() {
    return (
      <div className={style.root}>
        <Header />
        <TitleAndMetaTags
          title={'Page Not Found - ' + constants.siteName}
          ogUrl={createOgUrl()}
        />
        <div className={style.content}>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <div
            style={{
              maxWidth: 400,
              padding: '0 20px',
              margin: '0 auto'
            }}>
            <IconZanyFace />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Page;
