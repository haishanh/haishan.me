import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../components/PostList';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';
import '../utils/reset.scss';

export default ({ data }) => {
  console.log(data);
  return (
    <div>
      <TitleAndMetaTags
        title={'Posts - ' + constants.siteName}
        ogUrl={createOgUrl()}
      />
      <PostList edges={data.allMarkdownRemark.edges} />
    </div>
  );
};

export const pageQuery = graphql`
  query BlogPostsIndexQuery {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/posts/" }
        fields: { hidden: { ne: true } }
      }
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
