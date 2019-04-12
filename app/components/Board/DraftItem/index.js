import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

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
      this.props.destroy();
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
          <CloseButton onClick={this.props.destroy}>Discard</CloseButton>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  destroy: () => {},
  saveBoardItem: () => {},
};

Component.propTypes = {
  destroy: PropTypes.func,
  groupId: PropTypes.string,
  saveBoardItem: PropTypes.func,
  userId: PropTypes.string,
};

export default Component;
