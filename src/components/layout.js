import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default ({ children }) => (
  <StaticQuery
    query={query}
    render={data => <div className="layouts">{children}</div>}
  />
);
