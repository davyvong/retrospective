import React from 'react';
import PropTypes from 'prop-types';

import { UPDATE_DELAY } from 'constants/timings';

import { COLLECTION_TYPES } from 'firebase/constants';
import { deleteNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isAuthUID, isGUID, isType } from 'utils/validators';

import Input from './Input';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
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
        this.props.updateComment(
          constructDoc(this.props.id, { message: this.state.message }),
        );
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onBlur = () => {
    if (this.state.message === '') {
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }
      this.updateTimeout = setTimeout(() => {
        const queue = deleteNodeV2(
          constructDoc(this.props.id, this.props.node),
          COLLECTION_TYPES.COMMENTS,
        );
        this.props.executeBatch(queue);
      }, UPDATE_DELAY * 2);
    }
  };

  render() {
    return (
      <Input
        onBlur={this.onBlur}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        value={this.state.message}
      />
    );
  }
}

Component.defaultProps = {
  executeBatch: () => {},
  node: {},
  parent: {},
  placeholder: '',
  updateComment: () => {},
};

Component.propTypes = {
  executeBatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  node: PropTypes.object,
  parent: PropTypes.object,
  placeholder: PropTypes.string,
  updateComment: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
