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
    this.setState(prevState => ({
      items: this.reorder(
        prevState.items,
        result.source.index,
        result.destination.index,
      ),
    }));
  };

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  render() {
    const { items } = this.state;
    const { renderItem } = this.props;
    return (
      <Wrapper>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <Item {...provided.droppableProps} ref={provided.innerRef}>
                {items.map(renderItem)}
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
  renderItem: () => null,
};

Component.propTypes = {
  items: PropTypes.array, // eslint-disable-line react/no-unused-prop-types
  renderItem: PropTypes.func,
};

export default Component;
