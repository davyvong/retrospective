import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { COLLECTION_TYPES } from 'firebase/constants';
import { insertNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isAuthUID, isGUID, isType } from 'utils/validators';

import Input from './Input';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  save = event => {
    if (event.key !== 'Enter') {
      return;
    }
    const newId = uuidv4();
    if (this.validate()) {
      const queue = insertNodeV2(
        constructDoc(newId, {
          createdBy: this.props.userId,
          dateCreated: new Date().getTime(),
          message: this.state.message,
          parent: this.props.parentId,
        }),
        COLLECTION_TYPES.COMMENTS,
        constructDoc(this.props.parent.first, { prev: null }),
        false,
      );
      queue.push(
        constructDoc(
          this.props.parentId,
          { comments: this.props.parent.comments + 1 },
          COLLECTION_TYPES.ITEMS,
        ),
      );
      this.props.executeBatch(queue);
      this.setState({ message: '' });
    }
  };

  validate = () =>
    isAuthUID(this.props.userId) &&
    isType(this.state.message, 'String') &&
    this.state.message.length > 0 &&
    isGUID(this.props.parentId);

  update = event => {
    this.setState({ message: event.target.value });
  };

  render() {
    return (
      <Input
        onChange={this.update}
        onKeyDown={this.save}
        placeholder={this.props.placeholder}
        value={this.state.message}
      />
    );
  }
}

Component.defaultProps = {
  executeBatch: () => {},
  parent: {},
  placeholder: '',
};

Component.propTypes = {
  executeBatch: PropTypes.func,
  parent: PropTypes.object,
  parentId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  userId: PropTypes.string.isRequired,
};

export default Component;
