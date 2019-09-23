import React from 'react';
import { graphql } from 'gatsby';
import PostList from '../components/PostList';
import Layout from '../components/Layout';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import createOgUrl from '../utils/createOgUrl';
import constants from '../constants';
import '../utils/reset.css';

export default ({ data }) => {
  return (
    <Layout>
      <TitleAndMetaTags
        title={'Posts - ' + constants.siteName}
        ogUrl={createOgUrl()}
      />
      <PostList edges={data.allMarkdownRemark.edges} />
    </Layout>
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
