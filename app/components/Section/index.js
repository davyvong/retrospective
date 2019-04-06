import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

function Component(props) {
  return <section className="section">{props.children}</section>;
}

Component.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Component;
