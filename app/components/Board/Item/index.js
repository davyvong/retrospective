import React from 'react';
import PropTypes from 'prop-types';

import { ITEM_COLORS, COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { COLLECTION_TYPES } from 'firebase/constants';
import { deleteNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isType } from 'utils/validators';

import Button from './Button';
import CloseButton from './CloseButton';
import Content from './Content';
import DeleteButton from './DeleteButton';
import Footer from './Footer';
import Icon from './Icon';
import Message from './Message';
import VoteWrapper from './VoteWrapper';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  componentDidMount() {
    this.setState({ message: this.props.node.message });
  }

  componentWillReceiveProps(newProps) {
    if (
      isType(newProps.node.message, 'String') &&
      this.state.message !== newProps.node.message &&
      !this.updateTimeout
    ) {
      this.setState({ message: newProps.node.message });
    }
  }

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ message: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.updateItem(
          constructDoc(this.props.id, { message: this.state.message }),
        );
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onDelete = event => {
    event.preventDefault();
    const queue = deleteNodeV2(
      constructDoc(this.props.id, this.props.node),
      COLLECTION_TYPES.ITEMS,
    );
    this.props.executeBatch(queue);
  };

  onDownvote = event => {
    event.preventDefault();
    this.onVote('-');
  };

  onUpvote = event => {
    event.preventDefault();
    this.onVote('+');
  };

  onVote = direction => {
    let change = 0;
    if (direction === '+') {
      change = 1;
    }
    if (direction === '-') {
      change = -1;
    }
    if (
      this.props.remainingVotes < 0 ||
      (this.props.remainingVotes === 0 &&
        Math.abs(this.props.userVotes + change) >
          Math.abs(this.props.userVotes))
    ) {
      return;
    }
    const queue = [
      constructDoc(
        this.props.userId,
        { [this.props.id]: this.props.userVotes + change },
        COLLECTION_TYPES.VOTES,
      ),
      constructDoc(
        this.props.id,
        { votes: this.props.node.votes + change },
        COLLECTION_TYPES.ITEMS,
      ),
    ];
    this.props.executeBatch(queue);
  };

  openModal = event => {
    event.preventDefault();
    this.props.openModal(this.props.id);
  };

  render() {
    const { node, parent, showPopup, userVotes } = this.props;
    const { message } = this.state;
    return (
      <Wrapper
        color={node.color || parent.color || ITEM_COLORS.GREY}
        shadow={!showPopup}
      >
        <VoteWrapper>
          <Icon hover={COLORS.RED} onClick={this.onUpvote}>
            keyboard_arrow_up
          </Icon>
          <div>{node.votes}</div>
          <Icon hover={COLORS.BLUE} onClick={this.onDownvote}>
            keyboard_arrow_down
          </Icon>
        </VoteWrapper>
        <Content>
          <Message
            onChange={this.onChange}
            placeholder="Type a message here"
            value={message}
          />
          <Footer>
            <Button>You voted {userVotes}</Button>
            <Button onClick={this.openModal}>
              {node.comments === 0 ? 'No' : node.comments} comment
              {node.comments !== 1 && 's'}
            </Button>
          </Footer>
        </Content>
        {showPopup ? (
          <DeleteButton onClick={this.onDelete}>delete</DeleteButton>
        ) : (
          <CloseButton onClick={this.props.closeModal}>close</CloseButton>
        )}
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  closeModal: () => {},
  executeBatch: () => {},
  openModal: () => {},
  node: {},
  parent: {},
  remainingVotes: 0,
  showPopup: true,
  updateItem: () => {},
  userVotes: 0,
};

Component.propTypes = {
  closeModal: PropTypes.func,
  executeBatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  openModal: PropTypes.func,
  node: PropTypes.object,
  parent: PropTypes.object,
  remainingVotes: PropTypes.number,
  showPopup: PropTypes.bool,
  updateItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userVotes: PropTypes.number,
};

export default Component;
