import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import ModalContainer from 'components/Modal/Container';
import Title from 'components/Modal/Title';

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

  discard = () => {
    if (this.state.message === '') {
      this.props.disableCreateMode();
      return;
    }
    const disableCreateMode = () => {
      this.props.disableCreateMode();
      this.props.closeModal();
    };
    this.props.openModal({
      closeOnBackdrop: true,
      content: (
        <ModalContainer>
          <Title>Are you sure you want to discard this item?</Title>
          <Footer>
            <FooterButton onClick={this.props.closeModal}>Keep</FooterButton>
            <DiscardButton onClick={disableCreateMode}>Discard</DiscardButton>
          </Footer>
        </ModalContainer>
      ),
    });
  };

  save = () => {
    const newId = uuidv4();
    if (this.validate()) {
      const queue = insertNodeV2(
        constructDoc(newId, {
          comments: 0,
          createdBy: this.props.userId,
          dateCreated: new Date().getTime(),
          first: null,
          message: this.state.message,
          parent: this.props.parentId,
          votes: 0,
        }),
        COLLECTION_TYPES.ITEMS,
        constructDoc(this.props.parent.first, { prev: null }),
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
          async
          onChange={this.update}
          placeholder={this.props.placeholder}
          value={message}
        />
        <Footer>
          <FooterButton onClick={this.save}>Save</FooterButton>
          <DiscardButton onClick={this.discard}>Discard</DiscardButton>
        </Footer>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  closeModal: () => {},
  disableCreateMode: () => {},
  executeBatch: () => {},
  openModal: () => {},
  parent: {},
  placeholder: '',
};

Component.propTypes = {
  closeModal: PropTypes.func,
  disableCreateMode: PropTypes.func,
  executeBatch: PropTypes.func,
  openModal: PropTypes.func,
  parent: PropTypes.object,
  parentId: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  userId: PropTypes.string.isRequired,
};

export default Component;
