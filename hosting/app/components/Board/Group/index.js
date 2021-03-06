import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TwitterPicker } from 'react-color';
import uuidv4 from 'uuid/v4';

import { ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import DiscardButton from 'components/Board/DraftItem/DiscardButton';
import Footer from 'components/Board/DraftItem/Footer';
import FooterButton from 'components/Board/DraftItem/FooterButton';

import ModalContainer from 'components/Modal/Container';
import Title from 'components/Modal/Title';

import { COLLECTION_TYPES } from 'firebase/constants';
import {
  deleteNodeV2,
  insertNodeV2,
  renderListV1,
  reorderNodeV1,
  reorderNodeV2,
} from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import { isGUID, isType } from 'utils/validators';

import AddButton from './AddButton';
import ColorButton from './ColorButton';
import ColorWrapper from './ColorWrapper';
import CreateButton from './CreateButton';
import DeleteButton from './DeleteButton';
import Header from './Header';
import Items from './Items';
import List from './List';
import Name from './Name';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createMode: false,
      first: null,
      items: {},
      name: '',
    };
  }

  componentWillReceiveProps(newProps) {
    const state = {};
    if (
      isGUID(newProps.node.first) &&
      this.state.first !== newProps.node.first
    ) {
      state.first = newProps.node.first;
    }
    if (
      isType(newProps.node.name, 'String') &&
      this.state.name !== newProps.node.name &&
      !this.updateTimeout
    ) {
      state.name = newProps.node.name;
    }
    if (isType(newProps.items, 'Object')) {
      state.items = newProps.items;
    }
    this.setState(state);
  }

  enableCreateMode = () => {
    this.setState({ createMode: true });
  };

  disableCreateMode = () => {
    this.setState({ createMode: false });
  };

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ name: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.updateGroup(
          constructDoc(this.props.id, { name: this.state.name }),
        );
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onAdd = () => {
    const newId = uuidv4();
    const queue = insertNodeV2(
      constructDoc(newId, {
        color: ITEM_COLORS.GREY,
        createdBy: this.props.userId,
        dateCreated: new Date().getTime(),
        first: null,
        name: '',
        parent: this.props.boardId,
      }),
      COLLECTION_TYPES.GROUPS,
      constructDoc(this.props.id, this.props.node),
    );
    this.props.executeBatch(queue);
  };

  onDelete = () => {
    const queue = deleteNodeV2(
      constructDoc(this.props.id, this.props.node),
      COLLECTION_TYPES.GROUPS,
    );
    const executeBatch = () => {
      this.props.executeBatch(queue);
      this.props.closeModal();
    };
    this.props.openModal({
      closeOnBackdrop: true,
      content: (
        <ModalContainer>
          <Title>Are you sure you want to delete this column?</Title>
          <Footer>
            <FooterButton onClick={this.props.closeModal}>Keep</FooterButton>
            <DiscardButton onClick={executeBatch}>Delete</DiscardButton>
          </Footer>
        </ModalContainer>
      ),
    });
  };

  onDragEnd = result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const { first, items } = this.state;
    let destinationId = first;
    for (let i = 0; i < result.destination.index; i += 1) {
      if (isType(items[destinationId], 'Object')) {
        destinationId = items[destinationId].next;
      }
    }
    const sourceId = result.draggableId;
    const append = result.destination.index > result.source.index;
    const queue = reorderNodeV2(
      constructDoc(sourceId, items[sourceId]),
      COLLECTION_TYPES.ITEMS,
      constructDoc(destinationId, items[destinationId]),
      append,
    );
    const state = reorderNodeV1(
      { first, items },
      sourceId,
      destinationId,
      append,
    );
    this.setState(state, () => {
      this.props.executeBatch(queue);
    });
  };

  updateColor = color => {
    this.props.updateGroup(constructDoc(this.props.id, { color: color.hex }));
  };

  render() {
    const { createMode, first, items, name } = this.state;
    const { id, node, renderDraftItem, renderItem } = this.props;
    const colors = Object.values(ITEM_COLORS);
    return (
      <Wrapper color={node.color}>
        <Header>
          <Name
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            value={name}
          />
          <ColorWrapper>
            <ColorButton>color_lens</ColorButton>
            <TwitterPicker
              color={node.color}
              colors={colors}
              onChangeComplete={this.updateColor}
              triangle="top-right"
            />
          </ColorWrapper>
          <AddButton onClick={this.onAdd}>add</AddButton>
          <DeleteButton onClick={this.onDelete}>delete</DeleteButton>
        </Header>
        {createMode ? (
          renderDraftItem({
            disableCreateMode: this.disableCreateMode,
            parentId: id,
          })
        ) : (
          <CreateButton onClick={this.enableCreateMode}>Create</CreateButton>
        )}
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={id}>
              {provided => (
                <Items {...provided.droppableProps} ref={provided.innerRef}>
                  {renderListV1(items, first, renderItem)}
                  {provided.placeholder}
                </Items>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  closeModal: () => {},
  createItem: () => {},
  executeBatch: () => {},
  items: {},
  node: {},
  openModal: () => {},
  placeholder: '',
  renderDraftItem: () => null,
  renderItem: () => null,
  updateGroup: () => {},
};

Component.propTypes = {
  boardId: PropTypes.string,
  closeModal: PropTypes.func,
  createItem: PropTypes.func,
  executeBatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  items: PropTypes.object,
  node: PropTypes.object,
  openModal: PropTypes.func,
  placeholder: PropTypes.string,
  renderDraftItem: PropTypes.func,
  renderItem: PropTypes.func,
  updateGroup: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
