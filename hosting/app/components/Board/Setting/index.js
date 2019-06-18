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
    if (this.state.value !== newProps.value && !this.updateTimeout) {
      if (isType(newProps.value, 'String')) {
        this.setState({ value: newProps.value });
      } else if (isType(newProps.value, 'Number')) {
        this.setState({ value: newProps.value.toString() });
      }
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
        <span>{this.props.prefix}</span>
        <Input
          {...this.props}
          onChange={this.props.disabled ? null : this.onChange}
          value={this.state.value}
        />
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  prefix: '',
  update: () => {},
  value: '',
};

Component.propTypes = {
  prefix: PropTypes.string,
  update: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Component;
