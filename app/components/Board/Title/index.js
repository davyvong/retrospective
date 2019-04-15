import React from 'react';
import PropTypes from 'prop-types';

import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validators';

import Input from './Input';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  componentWillReceiveProps(newProps) {
    if (
      isType(newProps.value, 'String') &&
      this.state.value !== newProps.value &&
      !this.updateTimeout
    ) {
      this.setState({ value: newProps.value });
    }
  }

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ value: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.update({ value: this.state.value });
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  render() {
    return (
      <Wrapper>
        <Input
          {...this.props}
          onChange={this.onChange}
          value={this.state.value}
        />
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  update: () => {},
  value: '',
};

Component.propTypes = {
  update: PropTypes.func,
  value: PropTypes.string,
};

export default Component;
