import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PublishTime from '../components/PublishTime';

import createOgUrl from '../utils/createOgUrl';

import jump from 'jump.js';

import '../utils/reset.scss';
import './prism-yo.scss';
import style from './post.module.scss';

export default class Post extends Component {
  componentDidMount() {
    const { toc, tocAnchor } = this;
    if (toc) {
      // stickToc
      const { fixed } = style;
      function stickToc() {
        var tocTop = tocAnchor.getBoundingClientRect().top;
        if (tocTop <= 0) {
          toc.classList.add(fixed);
        } else {
          toc.classList.remove(fixed);
        }
      }

      // set focused heading
      const { headings } = this.props.pathContext;
      let offsets = [];

      // waiting for browser re-layout
      setTimeout(() => {
        offsets = headings.map(
          h =>
            document.getElementById(h).getBoundingClientRect().top +
            window.pageYOffset
        );
      }, 5);

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
            // un focus previous one
            document
              .querySelector(`ul li a[href="#${focused}"]`)
              .classList.remove(style.focused);
          }
          document
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

      document.querySelectorAll('ul li a').forEach(a => {
        a.onclick = function(e) {
          e.preventDefault();
          const t = a.getAttribute('href');
          jump(t, { duration: 200 });
        };
      });
    }
  }

  renderToc(tableOfContents) {
    if (!tableOfContents || tableOfContents === '') return null;
    const post = this.props.data.markdownRemark;
    if (post.fields.type !== 'notes') return null;

    const { toc, tocContainer, tocTitle } = style;
    return (
      <div className={tocContainer} ref={el => (this.toc = el)}>
        <div className={tocTitle}>In this page</div>
        <div
          className={toc}
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
      </div>
    );
  }

  render() {
    const post = this.props.data.markdownRemark;
    const { title, hero, date } = post.frontmatter;
    const dateObj = new Date(date);

    const { article, contentWrapper, content } = style;
    return (
      <div>
        <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" />
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
            <h1 itemProp="headline">{title}</h1>
            <div className={style.meta}>
              <PublishTime date={dateObj} />
            </div>
            <div className={contentWrapper} ref={el => (this.tocAnchor = el)}>
              {this.renderToc(post.tableOfContents)}
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
