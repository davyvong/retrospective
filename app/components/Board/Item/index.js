import React from 'react';
import PropTypes from 'prop-types';

import { BOARD_ITEM_COLORS, COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validate';

import Content from './Content';
import Footer from './Footer';
import Hoverable from './Hoverable';
import Icon from './Icon';
import Lightbox from '../Lightbox';
import Message from './Message';
import Vote from './Vote';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lightbox: false,
      message: '',
    };
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

  closeLightbox = event => {
    event.preventDefault();
    this.setState({ lightbox: false });
  };

  openLightbox = event => {
    event.preventDefault();
    this.setState({ lightbox: true });
  };

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

  render() {
    const { item } = this.props;
    const { lightbox, message } = this.state;
    return (
      <Wrapper color={item.color ? `${item.color}80` : BOARD_ITEM_COLORS.GREY}>
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
          <Hoverable>
            <Message onChange={this.onChange} value={message} />
          </Hoverable>
          <Footer>
            <div>
              {item.comments === 0 ? 'No' : item.comments} Comment
              {item.comments !== 1 && 's'}
            </div>
            <button onClick={this.openLightbox} type="button">
              Expand
            </button>
          </Footer>
        </Content>
        <Lightbox
          close={this.closeLightbox}
          color={this.props.item.color}
          visible={lightbox}
        >
          <div>hello world</div>
        </Lightbox>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  item: {},
  onChange: () => null,
};

Component.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func,
};

export default Component;
