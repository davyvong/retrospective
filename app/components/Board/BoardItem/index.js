import React from 'react';
import PropTypes from 'prop-types';

import Body from './Body';
import Subject from './Subject';
import Wrapper from './Wrapper';

function Component(props) {
  const { id, item } = props;
  console.log(`"${id}":`, JSON.stringify(item, null, 2));
  return (
    <Wrapper color={`${item.color}80`}>
      <Subject>{item.subject}</Subject>
      <Body>{item.body}</Body>
    </Wrapper>
  );
}

Component.defaultProps = {
  item: {},
};

Component.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
};

export default Component;
