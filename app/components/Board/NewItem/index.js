import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';

import { isGUID, isType } from 'utils/validate';

import Footer from './Footer';
import Message from './Message';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  saveBoardItem = event => {
    event.preventDefault();
    if (
      isType(this.props.authorId, 'String') &&
      this.props.authorId.length === 28 &&
      isGUID(this.props.groupId) &&
      isType(this.state.message, 'String') &&
      this.state.message.length > 0
    ) {
      // this.props.saveBoardItem({
      console.log({
        data: {
          authorId: this.props.authorId,
          comments: 0,
          created: new Date().getTime(),
          groupId: this.props.groupId,
          message: this.state.message,
          votes: 0,
        },
        id: uuidv4(),
      });
    }
  };

  updateMessage = event => {
    event.preventDefault();
    this.setState({ message: event.target.value });
  };

  render() {
    const { message } = this.state;
    return (
      <Wrapper color={BOARD_ITEM_COLORS.GREY}>
        <Message
          onChange={this.updateMessage}
          placeholder="Type a message here"
          value={message}
        />
        <Footer>
          <div onClick={this.saveBoardItem}>SAVE_THIS_ITEM</div>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  saveBoardItem: () => {},
};

Component.propTypes = {
  authorId: PropTypes.string,
  groupId: PropTypes.string,
  saveBoardItem: PropTypes.func,
};

export default Component;
