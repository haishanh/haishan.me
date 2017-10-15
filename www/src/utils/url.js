'use strict';

function getPostUrl(slug) {
  // return `/posts${slug}`;
  return slug;
}

function getNoteUrl(slug) {
  // return `/notes${slug}`;
  return slug;
}

module.exports.getPostUrl = getPostUrl;
module.exports.getNoteUrl = getNoteUrl;
