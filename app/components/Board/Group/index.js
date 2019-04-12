import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { UPDATE_DELAY } from 'constants/timings';

import { isType } from 'utils/validate';

import Create from './Create';
import Item from './Item';
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
    const newState = { items: newProps.items };
    if (
      isType(newProps.group.name, 'String') &&
      this.state.name !== newProps.group.name &&
      !this.updateTimeout
    ) {
      newState.name = newProps.group.name;
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
    const { id, renderNewItem, renderItem } = this.props;
    return (
      <Wrapper>
        <Name
          onChange={this.onChange}
          placeholder="Type a column name"
          value={name}
        />
        {create ? (
          renderNewItem({ destroy: this.disableCreateMode, groupId: id })
        ) : (
          <Create onClick={this.enableCreateMode}>Create</Create>
        )}
        <List>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId={id}>
              {provided => (
                <Item {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map(renderItem)}
                  {provided.placeholder}
                </Item>
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
  renderNewItem: () => null,
  renderItem: () => null,
};

Component.propTypes = {
  createItem: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  onChange: PropTypes.func,
  renderNewItem: PropTypes.func,
  renderItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
