import React from 'react';
import PropTypes from 'prop-types';

import Bounce from './Bounce';
import DelayedBounce from './DelayedBounce';
import Spinner from './Spinner';

function Component(props) {
  return (
    <Spinner size={props.size}>
      <Bounce color={props.color} />
      <DelayedBounce color={props.color} />
    </Spinner>
  );
}

Component.defaultProps = {
  color: '#74b9ff',
  size: '40px',
};

Component.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

export default Component;
