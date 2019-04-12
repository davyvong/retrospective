import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import constructDoc from 'utils/constructDoc';
import { isAuthUID, isGUID, isType } from 'utils/validate';

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
    const timestamp = new Date().getTime();
    if (this.validateBoardItem()) {
      const updateQueue = [
        constructDoc(newId, {
          comments: 0,
          createdBy: this.props.userId,
          dateCreated: timestamp,
          dateModified: timestamp,
          first: null,
          groupId: this.props.groupId,
          message: this.state.message,
          modifiedBy: this.props.userId,
          next: this.props.group.first,
          prev: null,
          votes: 0,
        }),
      ];
      if (isGUID(this.props.group.first)) {
        updateQueue.push(
          constructDoc(this.props.group.first, {
            dateModified: timestamp,
            modifiedBy: this.props.userId,
            prev: newId,
          }),
        );
      }
      updateQueue.forEach(update => this.props.updateBoardItem(update));
      this.props.updateBoardGroup(
        constructDoc(this.props.groupId, {
          dateModified: timestamp,
          modifiedBy: this.props.userId,
          first: newId,
        }),
      );
      this.props.disableCreateMode();
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
  group: {},
  updateBoardGroup: () => {},
  updateBoardItem: () => {},
};

Component.propTypes = {
  disableCreateMode: PropTypes.func,
  group: PropTypes.object,
  groupId: PropTypes.string,
  updateBoardGroup: PropTypes.func,
  updateBoardItem: PropTypes.func,
  userId: PropTypes.string,
};

export default Component;
