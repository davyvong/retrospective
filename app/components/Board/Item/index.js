import React from 'react';
import PropTypes from 'prop-types';

import { BOARD_ITEM_COLORS } from 'constants/colors';

import { isType } from 'utils/validate';

import Footer from './Footer';
import Hoverable from './Hoverable';
import Lock from './Lock';
import Message from './Message';
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
      }, 2000);
    });
  };

  render() {
    const { item } = this.props;
    const { message } = this.state;
    return (
      <Wrapper color={item.color ? `${item.color}80` : BOARD_ITEM_COLORS.GREY}>
        <Hoverable>
          <Message
            disabled={item.locked}
            onChange={this.onChange}
            value={message}
          />
        </Hoverable>
        {item.locked && <Lock />}
        <Footer>
          <div>
            {item.upvotes > 0 ? item.upvotes : 'No'} Upvote
            {item.upvotes !== 1 && 's'}
          </div>
        </Footer>
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
