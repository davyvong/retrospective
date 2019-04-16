import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import { COLLECTION_TYPES } from 'firebase/constants';
import { insertNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isAuthUID, isGUID, isType } from 'utils/validators';

import DiscardButton from './DiscardButton';
import Footer from './Footer';
import FooterButton from './FooterButton';
import Message from './Message';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  save = () => {
    const newId = uuidv4();
    if (this.validate()) {
      const queue = insertNodeV2(
        constructDoc(newId, {
          comments: 0,
          createdBy: this.props.userId,
          dateCreated: new Date().getTime(),
          child: null,
          message: this.state.message,
          parent: this.props.parentId,
          votes: 0,
        }),
        COLLECTION_TYPES.ITEMS,
        constructDoc(this.props.parent.child, { prev: null }),
        false,
      );
      this.props.executeBatch(queue);
      this.props.disableCreateMode();
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
    const { message } = this.state;
    return (
      <Wrapper>
        <Message
          onChange={this.update}
          placeholder={this.props.placeholder}
          value={message}
        />
        <Footer>
          <FooterButton onClick={this.save}>Save</FooterButton>
          <DiscardButton onClick={this.props.disableCreateMode}>
            Discard
          </DiscardButton>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  disableCreateMode: () => {},
  executeBatch: () => {},
  parent: {},
  placeholder: '',
};

Component.propTypes = {
  disableCreateMode: PropTypes.func,
  executeBatch: PropTypes.func,
  parent: PropTypes.object,
  parentId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  userId: PropTypes.string.isRequired,
};

export default Component;
