import React from 'react';
import Helmet from 'react-helmet';

const defaultDescription = 'Haishan website';
const defaultOgImage =
  'https://img10.360buyimg.com/img/jfs/t1/84166/15/9874/13645/5d74ad77E4f5edf27/17a60fa0632a6d8f.jpg';

const TitleAndMetaTags = ({ title, ogDescription, ogUrl, ogImage }) => {
  return (
    <Helmet title={title}>
      <meta name="Description" content={ogDescription || defaultDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
    </Helmet>
  );
};

export default TitleAndMetaTags;
