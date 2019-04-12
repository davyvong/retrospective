import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';

import { Draggable } from 'react-beautiful-dnd';

import Container from 'components/Board/Container';
import Group from 'components/Board/Group';
import Item from 'components/Board/Item';
import DraftItem from 'components/Board/DraftItem';
import Subtitle from 'components/Board/Subtitle';
import Title from 'components/Board/Title';
import Columns from 'components/Bulma/Columns';
import Section from 'components/Bulma/Section';
import FullScreen from 'components/FullScreen';
import ModalContainer from 'components/Modal/Container';
import Spinner from 'components/Spinner';

import {
  closeModal as closeModalAction,
  openModal as openModalAction,
} from 'containers/Modal/actions';
import { selectAuthUID } from 'containers/AuthProvider/selectors';

import constructDoc from 'utils/constructDoc';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { isGUID, isType } from 'utils/validators';

import {
  initializeBoard as initializeBoardAction,
  removeBoardGroup as removeBoardGroupAction,
  updateBoardGroup as updateBoardGroupAction,
  updateBoardInfo as updateBoardInfoAction,
  removeBoardItem as removeBoardItemAction,
  updateBoardItem as updateBoardItemAction,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import {
  selectBoardGroups,
  selectBoardInfo,
  selectBoardItems,
} from './selectors';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.initializeBoard(this.props.match.params.boardId);
  }

  openModalItem = id => {
    const item = this.props.items[id];
    this.props.openModal({
      content: (
        <ModalContainer>
          <Item
            closeModal={this.props.closeModal}
            group={this.props.groups[item.groupId]}
            id={id}
            item={item}
            showPopup={false}
            showShadow
            updateBoardItem={this.updateBoardItem}
          />
        </ModalContainer>
      ),
    });
  };

  filterCollection = (collection, key, value) => {
    const filteredCollection = Object.assign({}, collection);
    Object.keys(collection).forEach(id => {
      if (filteredCollection[id][key] !== value) {
        delete filteredCollection[id];
      }
    });
    return filteredCollection;
  };

  sortCollection = (collection, key, direction = false) =>
    Object.keys(collection).sort((a, b) => {
      if (direction) {
        return collection[a][key] - collection[b][key];
      }
      return collection[b][key] - collection[a][key];
    });

  renderDraftItem = ({ disableCreateMode, groupId }) => (
    <DraftItem
      disableCreateMode={disableCreateMode}
      group={this.props.groups[groupId]}
      groupId={groupId}
      updateBoardGroup={this.updateBoardGroup}
      updateBoardItem={this.updateBoardItem}
      userId={this.props.uid}
    />
  );

  renderGroup = id => {
    const filteredItems = this.filterCollection(
      this.props.items,
      'groupId',
      id,
    );
    const group = this.props.groups[id];
    const renderItemList = () =>
      this.renderLinkedList(filteredItems, group.first, this.renderItem);
    return (
      <Group
        createItem={this.createItem}
        group={group}
        id={id}
        key={id}
        removeBoardGroup={this.props.removeBoardGroup}
        renderDraftItem={this.renderDraftItem}
        renderItemList={renderItemList}
        updateBoardGroup={this.updateBoardGroup}
        updateBoardInfo={this.updateBoardInfo}
        userId={this.props.uid}
      />
    );
  };

  renderItem = (id, index) => {
    const item = this.props.items[id];
    if (!item) {
      return null;
    }
    return (
      <Draggable draggableId={id} key={id} index={index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Item
              group={this.props.groups[item.groupId]}
              id={id}
              item={item}
              openModalItem={this.openModalItem}
              removeBoardItem={this.props.removeBoardItem}
              updateBoardGroup={this.updateBoardGroup}
              updateBoardItem={this.updateBoardItem}
            />
          </div>
        )}
      </Draggable>
    );
  };

  renderLinkedList = (map, first, renderer) => {
    const list = [];
    let current = first;
    while (isGUID(current, 'String') && isType(map[current], 'Object')) {
      list.push(current);
      current = map[current].next;
    }
    return list.map(renderer);
  };

  updateBoardGroup = doc => {
    this.props.updateBoardGroup(doc);
  };

  updateBoardInfo = data => {
    this.props.updateBoardInfo(constructDoc(undefined, data));
  };

  updateBoardItem = doc => {
    this.props.updateBoardItem(doc);
  };

  render() {
    const { subtitle, title } = this.props.info;
    if (!isType(subtitle, 'String') && !isType(title, 'String')) {
      return (
        <FullScreen>
          <Spinner size="5rem" />
        </FullScreen>
      );
    }
    const { groups, info, intl } = this.props;
    return (
      <div>
        <Section style={{ paddingBottom: 0 }}>
          <Container>
            <Title
              onChange={this.updateBoardInfo}
              placeholder={intl.formatMessage(messages.title)}
              value={title}
            />
            <Subtitle
              onChange={this.updateBoardInfo}
              placeholder={intl.formatMessage(messages.subtitle)}
              value={subtitle}
            />
          </Container>
        </Section>
        <Section style={{ paddingTop: 0 }}>
          <Container>
            <Columns>
              {this.renderLinkedList(groups, info.first, this.renderGroup)}
            </Columns>
          </Container>
        </Section>
      </div>
    );
  }
}

Component.defaultProps = {
  groups: {},
  info: {},
  items: {},
};

Component.propTypes = {
  closeModal: PropTypes.func,
  groups: PropTypes.object,
  info: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.object,
  openModal: PropTypes.func,
  removeBoardGroup: PropTypes.func,
  updateBoardGroup: PropTypes.func,
  updateBoardInfo: PropTypes.func,
  removeBoardItem: PropTypes.func,
  updateBoardItem: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  groups: selectBoardGroups(),
  info: selectBoardInfo(),
  items: selectBoardItems(),
  uid: selectAuthUID(),
});

export const mapDispatchToProps = dispatch => ({
  initializeBoard: params => dispatch(initializeBoardAction.request(params)),
  closeModal: params => dispatch(closeModalAction(params)),
  openModal: params => dispatch(openModalAction(params)),
  removeBoardGroup: params => dispatch(removeBoardGroupAction.request(params)),
  updateBoardGroup: params => dispatch(updateBoardGroupAction.request(params)),
  updateBoardInfo: params => dispatch(updateBoardInfoAction.request(params)),
  removeBoardItem: params => dispatch(removeBoardItemAction.request(params)),
  updateBoardItem: params => dispatch(updateBoardItemAction.request(params)),
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
