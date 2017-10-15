import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PublishTime from '../components/PublishTime';

import Link from 'gatsby-link';
import style from './PostList.module.scss';

export default class PostList extends Component {
  render() {
    const edges = this.props.edges;
    return (
      <div>
        <Header />
        <main role="main">
          <ul className={style.list}>
            {edges.map((e, i) => {
              const date = new Date(e.node.frontmatter.date);
              const url = e.node.fields.url;
              return (
                <li key={i}>
                  <h2>
                    <Link to={url}>{e.node.frontmatter.title}</Link>
                  </h2>
                  <PublishTime date={date} />
                </li>
              );
            })}
          </ul>
        </main>
        <Footer />
      </div>
    );
  }
}
