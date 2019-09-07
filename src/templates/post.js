import React, { Component } from 'react';
import { graphql } from "gatsby"

import Header from '../components/Header';
import Footer from '../components/Footer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PublishTime from '../components/PublishTime';

import createOgUrl from '../utils/createOgUrl';

import jump from 'jump.js';

import '../utils/reset.css';
import './prism-yo.css';
import style from './post.module.css';

export default class Post extends Component {
  dom = {};

  componentDidMount() {
    const { toc, tocStickAnchor } = this.dom;
    if (toc) {
      // stickToc
      const { fixed } = style;
      function stickToc() {
        const tocTop = tocStickAnchor.getBoundingClientRect().top;
        if (tocTop <= 0) {
          toc.classList.add(fixed);
        } else {
          toc.classList.remove(fixed);
        }
      }

      // set focused heading
      const { headings } = this.props.pageContext;
      let offsets = [];

      // waiting for browser re-layout
      setTimeout(() => {
        offsets = headings.map(
          h =>
            document.getElementById(h).getBoundingClientRect().top +
            window.pageYOffset
        );
      }, 5);

      const tocClassName = style.tocContainer;

      let focused = null;
      function toggleFocusedHeading() {
        const scrollY = window.scrollY;
        let cur = null;
        for (let i = 0; i < offsets.length; i++) {
          if (scrollY < offsets[i]) break;
          if (scrollY >= offsets[i]) cur = headings[i];
        }
        if (null !== cur && focused !== cur) {
          if (focused) {
            // blur previous one
            toc
              .querySelector(`ul li a[href="#${focused}"]`)
              .classList.remove(style.focused);
          }
          toc
            .querySelector(`ul li a[href="#${cur}"]`)
            .classList.add(style.focused);
          focused = cur;
        }
      }

      // add event listener
      let ticking = false;
      function requestTick() {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            stickToc();
            toggleFocusedHeading();
            ticking = false;
          });
        }
      }
      window.addEventListener('scroll', requestTick);

      const tocEl = document.getElementsByClassName(tocClassName)[0];
      if (tocEl) {
        tocEl.addEventListener('click', e => {
          if (e.target.nodeName.toLowerCase() !== 'a') return;
          e.preventDefault();
          const t = e.target.getAttribute('href');
          jump(t, { duration: 200 });
        });
      }
    }
  }

  renderToc(tableOfContents) {
    if (!tableOfContents || tableOfContents === '') return null;
    const post = this.props.data.markdownRemark;
    if (post.fields.type !== 'notes') return null;

    const { toc, tocContainer, tocTitle } = style;
    return (
      <div className={tocContainer} ref={el => (this.dom.toc = el)}>
        <div className={tocTitle}>In this page</div>
        <div
          className={toc}
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
      </div>
    );
  }

  render() {
    const { toc } = this.props.pageContext;
    const post = this.props.data.markdownRemark;
    const { title, hero, date } = post.frontmatter;
    const dateObj = new Date(date);

    let headerStyle = {};
    let headerWrapperStyle = {};
    if (hero) {
      const bgSize = hero.size || 'cover';
      const bgHeight = hero.height || '450px';
      const bgPosition = hero.position || 'center';
      const bgRepeat = hero.repeat || 'no-repeat';
      const bgColor = hero.color ? hero.color : false;
      const bgImg = hero.image ? `url(${hero.image})` : false;
      headerStyle = {
        textAlign: 'left',
        color: '#fff',
        height: bgHeight,
        backgroundImage: bgImg,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
        backgroundRepeat: bgRepeat,
        backgroundColor: bgColor
      };
      headerWrapperStyle = {
        position: 'absolute',
        bottom: '10%',
        paddingLeft: '10%',
        width: '100%'
      };
    }

    const { article, contentWrapper, content } = style;
    return (
      <div>
        <link
          href="https://fonts.googleapis.com/css?family=Inconsolata"
          rel="stylesheet"
        />
        <TitleAndMetaTags
          ogDescription={post.excerpt}
          ogUrl={createOgUrl(post.fields.url)}
          title={`${title} - haishan.me`}
        />
        <Header hero={hero} />
        <main role="main">
          <article
            className={article}
            itemScope
            itemType="http://schema.org/BlogPosting"
          >
            <header className={style.articleHeader} style={headerStyle}>
              <div style={headerWrapperStyle}>
                <h1 itemProp="headline">{title}</h1>
                <div className={style.meta}>
                  <PublishTime date={dateObj} />
                </div>
              </div>
            </header>
            <div
              className={contentWrapper}
              ref={el => (this.dom.tocStickAnchor = el)}
            >
              {this.renderToc(toc)}
              <div
                className={content}
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }
}

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 500)
      frontmatter {
        title
        date
        hero {
          image
          height
          size
          position
          color
        }
      }
      fields {
        type
        url
      }
      tableOfContents
    }
  }
`;
