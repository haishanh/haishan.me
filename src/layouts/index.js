import React from 'react';

export default ({ children, data }) => {
  return <div className="layouts">{children()}</div>;
};

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
