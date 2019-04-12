import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import uuidv4 from 'uuid/v4';

import { BOARD_ITEM_COLORS } from 'constants/colors';
import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validate';

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
      create: false,
      items: [],
      name: '',
    };
  }

  componentDidMount() {
    this.setState({
      items: this.props.items,
      name: this.props.group.name,
    });
  }

  componentWillReceiveProps(newProps) {
    const newState = {};
    const { group, items } = newProps;
    if (isType(items, 'Array')) {
      newState.items = items;
    }
    if (
      isType(group.name, 'String') &&
      this.state.name !== group.name &&
      !this.updateTimeout
    ) {
      newState.name = group.name;
    }
    this.setState(newState);
  }

  enableCreateMode = event => {
    event.preventDefault();
    this.setState({ create: true });
  };

  disableCreateMode = () => {
    this.setState({ create: false });
  };

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ name: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.onChange({
          data: {
            dateModified: new Date().getTime(),
            modifiedBy: this.props.userId,
            name: this.state.name,
          },
          id: this.props.id,
        });
        this.updateTimeout = undefined;
      }, UPDATE_DELAY);
    });
  };

  onAdd = event => {
    event.preventDefault();
    const timestamp = new Date().getTime();
    this.props.onChange({
      data: {
        color: BOARD_ITEM_COLORS.GREY,
        createdBy: this.props.userId,
        dateCreated: timestamp,
        dateModified: timestamp,
        modifiedBy: this.props.userId,
        name: '',
      },
      id: uuidv4(),
    });
  };

  onDelete = event => {
    event.preventDefault();
    this.props.removeBoardGroup({ id: this.props.id });
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    this.setState(prevState => ({
      items: this.reorder(
        prevState.items,
        result.source.index,
        result.destination.index,
      ),
    }));
  };

  reorder = (items, start, end) => {
    const result = Array.from(items);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  };

  render() {
    const { create, items, name } = this.state;
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
        {create ? (
          renderDraftItem({ destroy: this.disableCreateMode, groupId: id })
        ) : (
          <CreateButton onClick={this.enableCreateMode}>Create</CreateButton>
        )}
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={id}>
              {provided => (
                <Items {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map(renderItem)}
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
  items: [],
  onChange: () => {},
  removeBoardGroup: () => {},
  renderDraftItem: () => null,
  renderItem: () => null,
};

Component.propTypes = {
  createItem: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  onChange: PropTypes.func,
  removeBoardGroup: PropTypes.func,
  renderDraftItem: PropTypes.func,
  renderItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
