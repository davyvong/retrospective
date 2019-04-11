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

  createItem = event => {
    event.preventDefault();
    this.props.createItem({ groupId: this.props.id });
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
    const { items, name } = this.state;
    const { id, renderItem } = this.props;
    return (
      <Wrapper>
        <Name
          onChange={this.onChange}
          placeholder="Type a column name"
          value={name}
        />
        <Create onClick={this.createItem}>Create</Create>
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
  renderItem: () => null,
};

Component.propTypes = {
  createItem: PropTypes.func,
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  onChange: PropTypes.func,
  renderItem: PropTypes.func,
  userId: PropTypes.string.isRequired,
};

export default Component;
