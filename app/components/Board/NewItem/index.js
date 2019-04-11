import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';

import { isGUID, isType } from 'utils/validate';

import Button from './Button';
import Close from './Close';
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
    if (this.validateBoardItem()) {
      this.props.saveBoardItem({
        data: {
          authorId: this.props.authorId,
          color: this.props.group.color,
          comments: 0,
          created: new Date().getTime(),
          groupId: this.props.group.id,
          message: this.state.message,
          votes: 0,
        },
        id: uuidv4(),
      });
      this.props.closeModal();
    }
  };

  validateBoardItem = () =>
    isType(this.props.authorId, 'String') &&
    this.props.authorId.length === 28 &&
    isGUID(this.props.group.id) &&
    isType(this.state.message, 'String') &&
    this.state.message.length > 0 &&
    true === false;

  updateMessage = event => {
    event.preventDefault();
    this.setState({ message: event.target.value });
  };

  render() {
    const { message } = this.state;
    return (
      <Wrapper color={this.props.group.color || BOARD_ITEM_COLORS.GREY}>
        <Message
          onChange={this.updateMessage}
          placeholder="Type a message here"
          value={message}
        />
        <Footer>
          <Button onClick={this.saveBoardItem}>Create</Button>
          <Close onClick={this.props.closeModal}>Discard</Close>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  closeModal: () => {},
  group: {},
  saveBoardItem: () => {},
};

Component.propTypes = {
  authorId: PropTypes.string,
  closeModal: PropTypes.func,
  group: PropTypes.object,
  saveBoardItem: PropTypes.func,
};

export default Component;
