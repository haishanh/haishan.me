import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../components/PostList';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';
import '../utils/reset.scss';

export default ({ data }) => {
  return (
    <div>
      <TitleAndMetaTags
        title={'Notes - ' + constants.siteName}
        ogUrl={createOgUrl()}
      />
      <PostList edges={data.allMarkdownRemark.edges} />
    </div>
  );
};

export const pageQuery = graphql`
  query BlogNotesIndexQuery {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "/notes/" }
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
