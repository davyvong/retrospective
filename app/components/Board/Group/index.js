import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { constructDoc } from 'utils/firebase';
import linkedList from 'utils/linkedList';
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
    linkedList.insertNode(
      constructDoc(this.props.id, this.props.group),
      true,
      constructDoc(newId, {
        color: BOARD_ITEM_COLORS.GREY,
        createdBy: this.props.userId,
        dateCreated: new Date().getTime(),
        first: null,
        name: '',
      }),
      this.props.updateBoardGroup,
      undefined,
      this.props.updateBoardInfo,
    );
  };

  onDelete = event => {
    event.preventDefault();
    linkedList.deleteNode(
      this.props.group,
      this.props.updateBoardGroup,
      undefined,
      this.props.updateBoardInfo,
    );
    this.props.removeBoardGroup({ id: this.props.id });
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
    const state = linkedList.reorderNode(
      {
        first: this.state.first,
        items: this.state.items,
      },
      destination,
      source,
      result.destination.index > result.source.index,
    );
    this.setState(state, () => {
      // linkedList.deleteNode(
      //   this.props.items[source],
      //   this.props.updateBoardItem,
      //   this.props.id,
      //   this.props.updateBoardGroup,
      // );
      // linkedList.insertNode(
      //   constructDoc(destination, this.props.items[destination]),
      //   result.destination.index > result.source.index,
      //   constructDoc(source, this.props.items[source]),
      //   this.props.updateBoardItem,
      //   this.props.id,
      //   this.props.updateBoardGroup,
      // );
    });
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
            groupId: id,
          })
        ) : (
          <CreateButton onClick={this.enableCreateMode}>Create</CreateButton>
        )}
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={id}>
              {provided => (
                <Items {...provided.droppableProps} ref={provided.innerRef}>
                  {linkedList.render(items, first, renderItem)}
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
  group: {},
  items: {},
  removeBoardGroup: () => {},
  renderDraftItem: () => null,
  renderItem: () => null,
  updateBoardGroup: () => {},
  updateBoardInfo: () => {},
  updateBoardItem: () => {},
};

Component.propTypes = {
  createItem: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.object,
  removeBoardGroup: PropTypes.func,
  renderDraftItem: PropTypes.func,
  renderItem: PropTypes.func,
  updateBoardGroup: PropTypes.func,
  updateBoardInfo: PropTypes.func,
  updateBoardItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
