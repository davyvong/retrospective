import React from 'react';
import PropTypes from 'prop-types';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Wrapper from './Wrapper';

class Component extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { items, renderItem } = this.props;
    return <Wrapper>{items.map(renderItem)}</Wrapper>;
  }
}

Component.defaultProps = {
  items: [],
  renderItem: () => null,
};

Component.propTypes = {
  items: PropTypes.array,
  renderItem: PropTypes.func,
};

export default Component;
