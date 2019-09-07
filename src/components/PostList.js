import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PublishTime from '../components/PublishTime';

import { Link } from "gatsby"
import style from './PostList.module.css';

export default class PostList extends Component {
  static propTypes = {
    edges: PropTypes.array
  };

  render() {
    const { edges } = this.props;
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
