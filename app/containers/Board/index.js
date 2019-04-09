import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import { isEmpty, isEqual } from 'lodash';

import { Draggable } from 'react-beautiful-dnd';

import Columns from 'components/Board/Columns';
import Context from 'components/Board/Context';
import Group from 'components/Board/Group';
import Item from 'components/Board/Item';
import Title from 'components/Board/Title';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';
import FullScreen from 'components/FullScreen';
import Spinner from 'components/Spinner';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import {
  initializeBoard as initializeBoardAction,
  updateBoardInfo as updateBoardInfoAction,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import {
  selectBoardGroups,
  selectBoardId,
  selectBoardInfo,
  selectBoardItems,
} from './selectors';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.initializeBoard(this.props.match.params.boardId);
  }

  filterCollection = (collection, key, value) =>
    Object.keys(collection).filter(id => collection[id][key] === value);

  onReorder = items => {
    const { items: result } = this.props;
    items.forEach((item, index) => {
      if (result[item]) {
        result[item].order = index;
      }
    });
    console.log('onReorder', result);
  };

  renderGroup = id => (
    <Group
      group={this.props.groups[id]}
      id={id}
      items={this.filterCollection(this.props.items, 'groupId', id)}
      key={id}
      onChange={this.updateBoardGroup}
      onReorder={this.onReorder}
      renderItem={this.renderItem}
    />
  );

  renderItem = (id, index) => (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Item
            id={id}
            item={this.props.items[id]}
            onChange={this.updateBoardItem}
          />
        </div>
      )}
    </Draggable>
  );

  sortCollection = (collection, key, direction = false) =>
    Object.keys(collection).sort((a, b) => {
      if (direction) {
        return collection[a][key] - collection[b][key];
      }
      return collection[b][key] - collection[a][key];
    });

  updateBoardGroup = doc => console.log(doc);

  updateBoardInfo = data => {
    this.props.updateBoardInfo({
      data,
      id: this.props.id,
    });
  }

  updateBoardItem = doc => console.log(doc);

  render() {
    const { context, title } = this.props.info;
    if (!context && !title) {
      return (
        <FullScreen>
          <Spinner size="5rem" />
        </FullScreen>
      );
    }
    const { groups, id, intl } = this.props;
    return (
      <Section id={id}>
        <Container>
          <Title
            onChange={this.updateBoardInfo}
            placeholder={intl.formatMessage(messages.title)}
            value={title}
          />
          <Context
            onChange={this.updateBoardInfo}
            placeholder={intl.formatMessage(messages.context)}
            value={context}
          />
          <Columns>{Object.keys(groups).map(this.renderGroup)}</Columns>
        </Container>
      </Section>
    );
  }
}

Component.defaultProps = {
  groups: {},
  info: {},
  items: {},
};

Component.propTypes = {
  groups: PropTypes.object,
  id: PropTypes.string,
  info: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.object,
  updateBoardInfo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  groups: selectBoardGroups(),
  id: selectBoardId(),
  info: selectBoardInfo(),
  items: selectBoardItems(),
});

export const mapDispatchToProps = dispatch => ({
  initializeBoard: params => dispatch(initializeBoardAction.request(params)),
  updateBoardInfo: params => dispatch(updateBoardInfoAction.request(params)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'board', reducer });
const withSaga = injectSaga({ key: 'board', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  injectIntl,
)(Component);
