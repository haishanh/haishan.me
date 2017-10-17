'use strict';

import constants from '../constants';

export default function createOgUrl(url = '') {
  return constants.baseUrl + url.replace(/^\//, '');
}
