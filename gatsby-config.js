'use strict';

const autoprefixer = require('autoprefixer');

module.exports = {
  siteMetadata: {
    title: 'haishan.me'
  },
  plugins: [
    {
      resolve: `gatsby-plugin-postcss-sass`,
      options: {
        postCssPlugins: [autoprefixer()],
        precision: 8
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: ['gatsby-remark-prismjs', 'gatsby-remark-autolink-headers']
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'haishan.me',
        short_name: 'haishan.me',
        start_url: '/',
        background_color: '#00000',
        theme_color: '#000000',
        display: 'minimal-ui'
      }
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-76464910-3'
      }
    }
  ]
};
