import React from 'react';
import PropTypes from 'prop-types';

import { BOARD_ITEM_COLORS, COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validate';

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
        this.props.onChange({
          data: { message: this.state.message },
          id: this.props.id,
        });
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onDelete = event => {
    event.preventDefault();
    this.props.removeBoardItem({ id: this.props.id });
  };

  onDownvote = event => {
    event.preventDefault();
    this.props.onChange({
      data: {
        dateModified: new Date().getTime(),
        modifiedBy: this.props.userId,
        votes: this.props.item.votes - 1,
      },
      id: this.props.id,
    });
  };

  onUpvote = event => {
    event.preventDefault();
    this.props.onChange({
      data: {
        dateModified: new Date().getTime(),
        modifiedBy: this.props.userId,
        votes: this.props.item.votes + 1,
      },
      id: this.props.id,
    });
  };

  openItem = event => {
    event.preventDefault();
    this.props.openItem(this.props.id);
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
            <Button onClick={this.openItem}>
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
  group: {},
  item: {},
  onChange: () => {},
  openItem: () => {},
  removeBoardItem: () => {},
  showPopup: true,
  showShadow: false,
};

Component.propTypes = {
  closeModal: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func,
  openItem: PropTypes.func,
  removeBoardItem: PropTypes.func,
  showPopup: PropTypes.bool,
  showShadow: PropTypes.bool,
  userId: PropTypes.string.isRequired,
};

export default Component;
