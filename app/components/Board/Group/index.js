import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

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
      child: null,
      items: {},
      name: '',
    };
  }

  componentWillReceiveProps(newProps) {
    const state = {};
    const { node, items } = newProps;
    if (isGUID(node.child) && this.state.child !== node.child) {
      state.child = node.child;
    }
    if (
      isType(node.name, 'String') &&
      this.state.name !== node.name &&
      !this.updateTimeout
    ) {
      state.name = node.name;
    }
    if (isType(items, 'Object')) {
      state.items = this.state.items;
      Object.keys(items).forEach(key => {
        if (
          !isType(state.items[key], 'Object') ||
          items[key].dateModified > state.items[key].dataModified
        ) {
          state.items[key] = items[key];
        }
      });
    }
    this.setState(state);
  }

  enableCreateMode = event => {
    event.preventDefault();
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

  onAdd = event => {
    event.preventDefault();
    const newId = uuidv4();
    const queue = insertNodeV2(
      constructDoc(newId, {
        color: BOARD_ITEM_COLORS.GREY,
        createdBy: this.props.userId,
        dateCreated: new Date().getTime(),
        child: null,
        name: '',
        parent: 'd9965f7c-0437-4bc3-8647-40e313058fe1',
      }),
      COLLECTION_TYPES.GROUPS,
      constructDoc(this.props.id, this.props.node),
    );
    this.props.executeBatch(queue);
  };

  onDelete = event => {
    event.preventDefault();
    const queue = deleteNodeV2(
      constructDoc(this.props.id, this.props.node),
      COLLECTION_TYPES.GROUPS,
    );
    this.props.executeBatch(queue);
  };

  onDragEnd = result => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const { child, items } = this.state;
    let destinationId = child;
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
      { child, items },
      sourceId,
      destinationId,
      append,
    );
    this.setState(state, () => {
      // this.props.executeBatch(queue);
      console.log(queue);
    });
  };

  render() {
    const { createMode, child, items, name } = this.state;
    const { id, node, renderDraftItem, renderItem } = this.props;
    return (
      <Wrapper color={node.color}>
        <Header>
          <Name
            onChange={this.onChange}
            placeholder="Type a column name"
            value={name}
          />
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
                  {renderListV1(items, child, renderItem)}
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
  createItem: () => {},
  executeBatch: () => {},
  items: {},
  node: {},
  renderDraftItem: () => null,
  renderItem: () => null,
  updateGroup: () => {},
};

Component.propTypes = {
  createItem: PropTypes.func,
  executeBatch: PropTypes.func,
  id: PropTypes.string.isRequired,
  items: PropTypes.object,
  node: PropTypes.object,
  renderDraftItem: PropTypes.func,
  renderItem: PropTypes.func,
  updateGroup: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
