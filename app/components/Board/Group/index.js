import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { COLLECTION_TYPES } from 'firebase/boards/constants';
import {
  deleteNodeV2,
  insertNodeV2,
  renderListV2,
  reorderNodeV1,
} from 'firebase/boards/core';
import { constructDoc } from 'firebase/boards/helpers';

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
      first: null,
      items: {},
      name: '',
    };
  }

  componentWillReceiveProps(newProps) {
    const state = {};
    const { group, items } = newProps;
    if (isGUID(group.first) && this.state.first !== group.first) {
      state.first = group.first;
    }
    if (
      isType(group.name, 'String') &&
      this.state.name !== group.name &&
      !this.updateTimeout
    ) {
      state.name = group.name;
    }
    if (isType(items, 'Object')) {
      state.items = Object.assign({}, this.state.items, items);
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
        this.props.updateBoardGroup(
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
        first: null,
        name: '',
        parent: 'd9965f7c-0437-4bc3-8647-40e313058fe1',
      }),
      COLLECTION_TYPES.GROUPS,
      constructDoc(this.props.id, this.props.group),
    );
    this.props.executeBatch(queue);
  };

  onDelete = event => {
    event.preventDefault();
    const queue = deleteNodeV2(
      constructDoc(this.props.id, this.props.group),
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
    let destination = this.state.first;
    for (let i = 0; i < result.destination.index; i += 1) {
      if (isType(this.state.items[destination], 'Object')) {
        destination = this.state.items[destination].next;
      }
    }
    const source = result.draggableId;
    const state = reorderNodeV1(
      {
        first: this.state.first,
        items: this.state.items,
      },
      destination,
      source,
      result.destination.index > result.source.index,
    );
    this.setState(state);
  };

  render() {
    const { createMode, first, items, name } = this.state;
    const { group, id, renderDraftItem, renderItem } = this.props;
    return (
      <Wrapper color={group.color}>
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
            parent: id,
          })
        ) : (
          <CreateButton onClick={this.enableCreateMode}>Create</CreateButton>
        )}
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={id}>
              {provided => (
                <Items {...provided.droppableProps} ref={provided.innerRef}>
                  {renderListV2(items, first, renderItem)}
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
  group: {},
  items: {},
  renderDraftItem: () => null,
  renderItem: () => null,
  updateBoardGroup: () => {},
};

Component.propTypes = {
  createItem: PropTypes.func,
  executeBatch: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.object,
  renderDraftItem: PropTypes.func,
  renderItem: PropTypes.func,
  updateBoardGroup: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
