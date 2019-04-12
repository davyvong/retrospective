import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import constructDoc from 'utils/constructDoc';
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
      name: '',
    };
  }

  componentDidMount() {
    this.setState({ name: this.props.group.name });
  }

  componentWillReceiveProps(newProps) {
    const { group } = newProps;
    if (
      isType(group.name, 'String') &&
      this.state.name !== group.name &&
      !this.updateTimeout
    ) {
      this.setState({ name: group.name });
    }
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
          constructDoc(this.props.id, {
            dateModified: new Date().getTime(),
            modifiedBy: this.props.userId,
            name: this.state.name,
          }),
        );
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onAdd = event => {
    event.preventDefault();
    const newId = uuidv4();
    const node = this.props.group;
    const timestamp = new Date().getTime();
    const updateQueue = [
      constructDoc(newId, {
        color: BOARD_ITEM_COLORS.GREY,
        createdBy: this.props.userId,
        dateCreated: timestamp,
        dateModified: timestamp,
        first: null,
        modifiedBy: this.props.userId,
        name: '',
        next: node.next,
        prev: this.props.id,
      }),
      constructDoc(this.props.id, {
        dateModified: timestamp,
        modifiedBy: this.props.userId,
        next: newId,
      }),
    ];
    if (isGUID(node.next)) {
      updateQueue.push(
        constructDoc(node.next, {
          dateModified: timestamp,
          modifiedBy: this.props.userId,
          prev: newId,
        }),
      );
    }
    updateQueue.forEach(update => this.props.updateBoardGroup(update));
  };

  onDelete = event => {
    event.preventDefault();
    const node = this.props.group;
    const timestamp = new Date().getTime();
    const updateQueue = [];
    if (isGUID(node.prev)) {
      updateQueue.push(
        constructDoc(node.prev, {
          dateModified: timestamp,
          modifiedBy: this.props.userId,
          next: node.next,
        }),
      );
    } else {
      this.props.updateBoardInfo({ first: node.next });
    }
    if (isGUID(node.next)) {
      updateQueue.push(
        constructDoc(node.next, {
          dateModified: timestamp,
          modifiedBy: this.props.userId,
          prev: node.prev,
        }),
      );
    }
    updateQueue.forEach(update => this.props.updateBoardGroup(update));
    this.props.removeBoardGroup({ id: this.props.id });
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    console.log(result);
  };

  render() {
    const { createMode, name } = this.state;
    const { group, id, renderDraftItem, renderItemList } = this.props;
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
                  {renderItemList()}
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
  removeBoardGroup: () => {},
  renderDraftItem: () => null,
  renderItemList: () => null,
  updateBoardGroup: () => {},
  updateBoardInfo: () => {},
};

Component.propTypes = {
  createItem: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  removeBoardGroup: PropTypes.func,
  renderDraftItem: PropTypes.func,
  renderItemList: PropTypes.func,
  updateBoardGroup: PropTypes.func,
  updateBoardInfo: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
