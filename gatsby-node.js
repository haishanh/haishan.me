'use strict';

const debug = require('debug')('www');
const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { getPostUrl, getNoteUrl } = require('./src/utils/url');

function preprocessToc(tocHtml) {
  // convert 
  // <a href="/notes/2015-09-24-bash/#getopts">getopts</a>
  // to
  // <a href="#getopts">getopts</a>
  return tocHtml.replace(/(href=")[\S]*?#/g, '$1#');
}


const headingPat = /"#(\S*?)"/g;

const getAllHeadings = toc => {
  let capture;
  let ret = [];
  while ((capture = headingPat.exec(toc))) {
    ret.push(capture[1]);
  }
  return ret;
};

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });
    debug('slug %s', slug);
    let type = '';
    let url = '';
    // node.fileAbsolutePath: '/x/y/z/content/notes/bash-shell.md'
    const filePath = node.fileAbsolutePath;
    const { dir, base } = path.parse(filePath);
    if (/notes$/.test(dir)) {
      type = 'notes';
      url = getNoteUrl(slug);
    } else if (/posts$/.test(dir)) {
      type = 'posts';
      url = getPostUrl(slug);
    }

    // debug('node: %o', node); 

    // _hello-world.md will be hidden
    // the page will be generated
    // but not listed in /posts /notes ...
    const hidden = /^_/.test(base) ? true : false;

    if (type === '') throw new Error(`can not resolve type for: ${filePath}`);

    createNodeField({
      node,
      name: 'slug',
      value: slug
    });
    createNodeField({
      node,
      name: 'type',
      value: type
    });
    createNodeField({
      node,
      name: 'url',
      value: url
    });
    createNodeField({
      node,
      name: 'hidden',
      value: hidden
    });
  }
};

const allMarkdownRemarkQuery = `{
allMarkdownRemark(
  sort: { order: DESC, fields: [frontmatter___date] }
  limit: 1000
) {
    edges {
      node {
        tableOfContents
        fileAbsolutePath
        fields {
          slug
          type
          url
        }
      }
    }
  }
}`;

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return graphql(allMarkdownRemarkQuery).then(result => {
    let edges;
    try {
      edges = result.data.allMarkdownRemark.edges;
    } catch (e) {
      throw new Error('error with markdown GraphQL data source');
    }

    // using same template for now
    // separate them for easy future extention
    const postTemplate = path.resolve('./src/templates/post.js');
    const noteTemplate = path.resolve('./src/templates/post.js');

    debug('generating each post');
    return Promise.map(edges, ({ node }) => {
      const { tableOfContents, fields } = node;
      const { slug, type, url } = fields;
      let component;
      if (type === 'notes') component = noteTemplate;
      if (type === 'posts') component = noteTemplate;
      debug('url', url);

      let headings = [];
      let toc;
      if (type === 'notes' && tableOfContents !== '' ) {
        toc = preprocessToc(tableOfContents);
        headings = getAllHeadings(toc);
        // debug('headings: %o', headings);
      }

      createPage({
        path: url,
        component,
        context: {
          // Data passed to context is available in page queries as GraphQL variables.
          // @see https://www.gatsbyjs.org/docs/bound-action-creators/#createPage
          slug,
          toc,
          headings
        }
      });
    });
  });
};
