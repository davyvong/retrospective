import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { COLLECTION_TYPES } from 'firebase/boards/constants';
import { insertNodeV2 } from 'firebase/boards/core';
import { constructDoc } from 'firebase/boards/helpers';

import { isAuthUID, isGUID, isType } from 'utils/validators';

import Button from './Button';
import CloseButton from './CloseButton';
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
    const newId = uuidv4();
    if (this.validateBoardItem()) {
      const queue = insertNodeV2(
        constructDoc(newId, {
          comments: 0,
          createdBy: this.props.userId,
          dateCreated: new Date().getTime(),
          first: null,
          message: this.state.message,
          parent: this.props.parent,
          votes: 0,
        }),
        COLLECTION_TYPES.ITEMS,
        constructDoc(this.props.group.first, { prev: null }),
        false,
      );
      this.props.executeBatch(queue);
      this.props.disableCreateMode();
    }
  };

  validateBoardItem = () =>
    isAuthUID(this.props.userId) &&
    isType(this.state.message, 'String') &&
    this.state.message.length > 0 &&
    isGUID(this.props.parent);

  updateMessage = event => {
    event.preventDefault();
    this.setState({ message: event.target.value });
  };

  render() {
    const { message } = this.state;
    return (
      <Wrapper>
        <Message
          onChange={this.updateMessage}
          placeholder="Type a message here"
          value={message}
        />
        <Footer>
          <Button onClick={this.saveBoardItem}>Save</Button>
          <CloseButton onClick={this.props.disableCreateMode}>
            Discard
          </CloseButton>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  disableCreateMode: () => {},
  executeBatch: () => {},
  group: {},
};

Component.propTypes = {
  disableCreateMode: PropTypes.func,
  executeBatch: PropTypes.func,
  group: PropTypes.object,
  parent: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Component;
