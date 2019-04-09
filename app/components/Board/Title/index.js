import React from 'react';
import PropTypes from 'prop-types';

import Input from './Input';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.value !== newProps.value && !this.updateTimeout) {
      this.setState({ value: newProps.value });
    }
  }

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ value: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.onChange({ title: this.state.value });
      }, 2000);
    });
  };

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }
}

Component.defaultProps = {
  value: '',
};

Component.propTypes = {
  value: PropTypes.string,
};

export default Component;
