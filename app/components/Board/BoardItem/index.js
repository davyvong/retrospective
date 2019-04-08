import React from 'react';
import PropTypes from 'prop-types';

import Body from './Body';
import Data from './Data';
import Footer from './Footer';
import Lock from './Lock';
import Subject from './Subject';
import Wrapper from './Wrapper';

function Component(props) {
  const { id, item } = props;
  return (
    <Wrapper color={`${item.color}80`}>
      <Subject>{item.subject}</Subject>
      <Body>{item.body}</Body>
      {item.isLocked && <Lock />}
      <Footer>
        <div>
          {item.upvotes > 0 ? item.upvotes : 'No'} Upvote
          {item.upvotes !== 1 && 's'}
        </div>
      </Footer>
      <Data color={`${item.color}60`}>
        {`"${id}":`}
        {JSON.stringify(item, null, 2)}
      </Data>
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
