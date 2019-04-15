import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';
import Wrapper from './Wrapper';

function Component(props) {
  return (
    <Wrapper>
      <span>{props.prefix}</span>
      <Input {...props} />
    </Wrapper>
  );
}

Component.defaultProps = {
  prefix: '',
};

Component.propTypes = {
  prefix: PropTypes.string,
};

export default Component;
