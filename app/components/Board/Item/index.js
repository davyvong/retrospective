import React from 'react';
import PropTypes from 'prop-types';

import { BOARD_ITEM_COLORS, COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validate';

import Content from './Content';
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

  onDownvote = event => {
    event.preventDefault();
    this.props.onChange({
      data: { votes: this.props.item.votes - 1 },
      id: this.props.id,
    });
  };

  onUpvote = event => {
    event.preventDefault();
    this.props.onChange({
      data: { votes: this.props.item.votes + 1 },
      id: this.props.id,
    });
  };

  openItem = event => {
    event.preventDefault();
    this.props.openItem(this.props.id);
  };

  render() {
    const { item, showPopup, showShadow } = this.props;
    const { message } = this.state;
    return (
      <Wrapper color={item.color || BOARD_ITEM_COLORS.GREY} shadow={showShadow}>
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
            <div>
              {item.comments === 0 ? 'No' : item.comments} Comment
              {item.comments !== 1 && 's'}
            </div>
            {showPopup && <div onClick={this.openItem}>OPEN_MODAL</div>}
          </Footer>
        </Content>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  item: {},
  onChange: () => {},
  openItem: () => {},
  showPopup: true,
  showShadow: false,
};

Component.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func,
  openItem: PropTypes.func,
  showPopup: PropTypes.bool,
  showShadow: PropTypes.bool,
};

export default Component;
