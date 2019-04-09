import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import Hoverable from './Hoverable';
import Lock from './Lock';
import Message from './Message';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    return (
      <Wrapper color={`${item.color}80`}>
        <Hoverable>
          <Message disabled value={item.message} />
        </Hoverable>
        {item.isLocked && <Lock />}
        <Footer>
          <div>
            {item.upvotes > 0 ? item.upvotes : 'No'} Upvote
            {item.upvotes !== 1 && 's'}
          </div>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  item: {},
};

Component.propTypes = {
  // id: PropTypes.string.isRequired,
  item: PropTypes.object,
};

export default Component;
