import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Layout.css';

function Layout({ theme = 'light', children }) {
  return <div className={cx('layout', theme)}>{children}</div>;
}

Layout.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  children: PropTypes.node
};

export default Layout;
