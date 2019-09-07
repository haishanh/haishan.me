import React from 'react';
import Helmet from 'react-helmet';

/**
 * fixing the font family for now
 */
export default function GoogleFonts() {
  return (
    <Helmet>
      <link
        href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
}
