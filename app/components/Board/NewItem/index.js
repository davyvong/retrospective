import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';

import { isAuthUID, isGUID, isType } from 'utils/validate';

import Button from './Button';
import Close from './Close';
import Footer from './Footer';
import Group from './Group';
import Message from './Message';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  saveBoardItem = event => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    if (this.validateBoardItem()) {
      this.props.saveBoardItem({
        data: {
          comments: 0,
          createdBy: this.props.userId,
          dateCreated: timestamp,
          dateModified: timestamp,
          groupId: this.props.groupId,
          message: this.state.message,
          modifiedBy: this.props.userId,
          votes: 0,
        },
        id: uuidv4(),
      });
      this.props.closeModal();
    }
  };

  validateBoardItem = () =>
    isAuthUID(this.props.userId) &&
    isGUID(this.props.groupId) &&
    isType(this.state.message, 'String') &&
    this.state.message.length > 0;

  updateMessage = event => {
    event.preventDefault();
    this.setState({ message: event.target.value });
  };

  render() {
    const { message } = this.state;
    const { color, name } = this.props.group;
    return (
      <Wrapper color={color || BOARD_ITEM_COLORS.GREY}>
        <Group>{name}</Group>
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
  closeModal: PropTypes.func,
  group: PropTypes.object,
  groupId: PropTypes.string,
  saveBoardItem: PropTypes.func,
  userId: PropTypes.string,
};

export default Component;
