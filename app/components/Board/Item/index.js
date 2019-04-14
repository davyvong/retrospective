import React from 'react';
import PropTypes from 'prop-types';

import { BOARD_ITEM_COLORS, COLORS } from 'constants/colors';
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
import Vote from './Vote';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  componentDidMount() {
    this.setState({ message: this.props.item.message });
  }

  componentWillReceiveProps(newProps) {
    if (
      isType(newProps.item.message, 'String') &&
      this.state.message !== newProps.item.message &&
      !this.updateTimeout
    ) {
      this.setState({ message: newProps.item.message });
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
      constructDoc(this.props.id, this.props.item),
      COLLECTION_TYPES.ITEMS,
    );
    this.props.executeBatch(queue);
  };

  onDownvote = event => {
    event.preventDefault();
    this.props.updateItem(
      constructDoc(this.props.id, { votes: this.props.item.votes - 1 }),
    );
  };

  onUpvote = event => {
    event.preventDefault();
    this.props.updateItem(
      constructDoc(this.props.id, { votes: this.props.item.votes + 1 }),
    );
  };

  openModal = event => {
    event.preventDefault();
    this.props.openModal(this.props.id);
  };

  render() {
    const { group, item, showPopup, showShadow } = this.props;
    const { message } = this.state;
    return (
      <Wrapper
        color={item.color || group.color || BOARD_ITEM_COLORS.GREY}
        shadow={showShadow}
      >
        <Vote>
          <Icon hover={COLORS.RED} onClick={this.onUpvote}>
            keyboard_arrow_up
          </Icon>
          <div>{item.votes}</div>
          <Icon hover={COLORS.BLUE} onClick={this.onDownvote}>
            keyboard_arrow_down
          </Icon>
        </Vote>
        <Content>
          <Message
            onChange={this.onChange}
            placeholder="Type a message here"
            value={message}
          />
          <Footer>
            <Button onClick={this.openModal}>
              {item.comments === 0 ? 'No' : item.comments} Comment
              {item.comments !== 1 && 's'}
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
  group: {},
  item: {},
  openModal: () => {},
  showPopup: true,
  showShadow: false,
  updateItem: () => {},
};

Component.propTypes = {
  closeModal: PropTypes.func,
  executeBatch: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  openModal: PropTypes.func,
  showPopup: PropTypes.bool,
  showShadow: PropTypes.bool,
  updateItem: PropTypes.func,
};

export default Component;
