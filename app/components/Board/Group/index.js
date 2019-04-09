import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { isType } from 'utils/validate';

import Item from './Item';
import Lock from './Lock';
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

  onChange = event => {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.setState({ name: event.target.value }, () => {
      this.updateTimeout = setTimeout(() => {
        this.props.onChange({
          data: { name: this.state.name },
          id: this.props.id,
        });
      }, 2000);
    });
  };

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    this.setState(
      prevState => ({
        items: this.reorder(
          prevState.items,
          result.source.index,
          result.destination.index,
        ),
      }),
      () => this.props.onReorder(this.state.items),
    );
  };

  reorder = (items, start, end) => {
    const result = Array.from(items);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  };

  render() {
    const { items, name } = this.state;
    const { group, id, renderItem } = this.props;
    return (
      <Wrapper>
        <Name
          defaultValue={name}
          disabled={group.locked}
          onChange={this.onChange}
        />
        {group.locked && <Lock />}
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
      </Wrapper>
    );
  }
}

Component.defaultProps = {
  group: {},
  items: [],
  onChange: () => null,
  onReorder: () => null,
  renderItem: () => null,
};

Component.propTypes = {
  group: PropTypes.object,
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  onChange: PropTypes.func,
  onReorder: PropTypes.func,
  renderItem: PropTypes.func,
};

export default Component;
