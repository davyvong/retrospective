import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Item from './Item';
import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ items: newProps.items });
  }

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
    const { items } = this.state;
    const { id, renderItem } = this.props;
    return (
      <Wrapper>
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
  items: [],
  onReorder: () => null,
  renderItem: () => null,
};

Component.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  onReorder: PropTypes.func,
  renderItem: PropTypes.func,
};

export default Component;