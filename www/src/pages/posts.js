import React, { Component } from 'react';
import PostList from '../components/PostList';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';

export default ({ data }) => {
  return (
    <div>
      <TitleAndMetaTags title={'Posts - ' + constants.siteName} ogUrl={createOgUrl()} />
      <PostList edges={data.allMarkdownRemark.edges} />
    </div>
  );
};

// <div dangerouslySetInnerHTML={{ __html: post.html }} />
export const pageQuery = graphql`
  query BlogPostsIndexQuery {
    allMarkdownRemark(
      filter: { id: { regex: "/posts/" }, fields: { hidden: { ne: true }} }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          frontmatter {
            title
            date
          }
          html
          fields {
            url
            hidden
          }
        }
      }
    }
  }
`;
