import React from 'react';
import PropTypes from 'prop-types';

import { isType } from 'utils/validate';

import Input from './Input';
import Lock from '../Lock';
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
        this.props.onChange({
          title: this.state.value,
          titleLocked: false,
        });
      }, 2000);
      if (!this.props.locked) {
        this.props.onChange({ titleLocked: true });
      }
    });
  };

  render() {
    const locked = Boolean(this.props.locked && !this.updateTimeout);
    return (
      <Wrapper>
        <Input
          {...this.props}
          disabled={locked}
          onChange={this.onChange}
          value={this.state.value}
        />
        {locked && (
          <Lock message="A user is editting the title" padding="0.5rem 0" />
        )}
      </Wrapper>
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
