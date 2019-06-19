import React from 'react';
import PropTypes from 'prop-types';

import { ITEM_COLORS, COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import ModalContainer from 'components/Modal/Container';
import Title from 'components/Modal/Title';

import { COLLECTION_TYPES } from 'firebase/constants';
import { deleteNodeV2, renderListV1 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isAuthUID, isGUID, isType } from 'utils/validators';

import Content from './Content';
import DiscardButton from './DiscardButton';
import Footer from './Footer';
import FooterButton from './FooterButton';
import Icon from './Icon';
import Message from './Message';
import VoteWrapper from './VoteWrapper';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      commentMode: false,
      message: '',
    };
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

  toggleCommentMode = () => {
    this.setState(prevState => ({ commentMode: !prevState.commentMode }));
  };

  validate = () =>
    isAuthUID(this.props.userId) &&
    isType(this.state.message, 'String') &&
    isGUID(this.props.node.parent) &&
    isGUID(this.props.id);

  onChange = event => {
    if (!this.validate()) {
      return;
    }
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

  onDelete = () => {
    const queue = deleteNodeV2(
      constructDoc(this.props.id, this.props.node),
      COLLECTION_TYPES.ITEMS,
    );
    const executeBatch = () => {
      this.props.executeBatch(queue);
      this.props.closeModal();
    };
    this.props.openModal({
      closeOnBackdrop: true,
      content: (
        <ModalContainer>
          <Title>Are you sure you want to delete this item?</Title>
          <Footer>
            <FooterButton onClick={this.props.closeModal}>Keep</FooterButton>
            <DiscardButton onClick={executeBatch}>Delete</DiscardButton>
          </Footer>
        </ModalContainer>
      ),
    });
  };

  onDownvote = () => {
    this.onVote('-');
  };

  onUpvote = () => {
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

  render() {
    const {
      comments,
      node,
      parent,
      placeholder,
      renderComment,
      renderDraftComment,
      userVotes,
    } = this.props;
    const { commentMode, message } = this.state;
    return (
      <Wrapper color={node.color || parent.color || ITEM_COLORS.GREY}>
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
            async
            onChange={this.onChange}
            placeholder={placeholder}
            value={message}
          />
          <Footer>
            <FooterButton onClick={this.toggleCommentMode}>
              {node.comments === 0 ? 'No' : node.comments} comment
              {node.comments !== 1 && 's'}
            </FooterButton>
            {userVotes !== 0 && (
              <FooterButton>
                {userVotes > 0 && '+'}
                {userVotes} Vote
                {Math.abs(userVotes) !== 1 && 's'}
              </FooterButton>
            )}
            <DiscardButton onClick={this.onDelete}>Delete</DiscardButton>
          </Footer>
          {commentMode && renderDraftComment({ parentId: this.props.id })}
          {commentMode && renderListV1(comments, node.first, renderComment)}
        </Content>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  closeModal: () => {},
  comments: {},
  executeBatch: () => {},
  node: {},
  openModal: () => {},
  parent: {},
  placeholder: '',
  remainingVotes: 0,
  renderComment: () => null,
  renderDraftComment: () => null,
  updateItem: () => {},
  userVotes: 0,
};

Component.propTypes = {
  closeModal: PropTypes.func,
  comments: PropTypes.object,
  executeBatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  node: PropTypes.object,
  openModal: PropTypes.func,
  parent: PropTypes.object,
  placeholder: PropTypes.string,
  remainingVotes: PropTypes.number,
  renderComment: PropTypes.func,
  renderDraftComment: PropTypes.func,
  updateItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
  userVotes: PropTypes.number,
};

export default Component;
