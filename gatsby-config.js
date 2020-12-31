"use strict";

const isDev = process.env.NODE_ENV !== "production";

const LOCAL_IDENT_NAME_DEV = "[path]_[name]_[local]_[hash:base64:5]";
const LOCAL_IDENT_NAME_PROD = "[hash:base64:10]";
const localIdentName = isDev ? LOCAL_IDENT_NAME_DEV : LOCAL_IDENT_NAME_PROD;

module.exports = {
  siteMetadata: {
    title: "haishan.me",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-postcss",
      options: {
        // syntax: 'postcss-scss',
        postCssPlugins: [
          require("postcss-import")(),
          require("postcss-nested")(),
          require("postcss-strip-inline-comments")(),
          require("postcss-utilities")(),
          require("autoprefixer")(),
        ],
        cssLoaderOptions: {
          // gatsby still using css-loader v1
          // https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/package.json#L50
          localIdentName,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-remark-prismjs", "gatsby-remark-autolink-headers"],
      },
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-76464910-3",
      },
    },
    "gatsby-plugin-netlify", // make sure to put last in the array
  ],
};
