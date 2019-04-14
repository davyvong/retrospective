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
import { selectUID } from 'containers/AuthProvider/selectors';

import { renderListV2 } from 'firebase/core';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { isType } from 'utils/validators';

import {
  executeBatch as executeBatchAction,
  initialize as initializeAction,
  updateBoard as updateBoardAction,
  updateGroup as updateGroupAction,
  updateItem as updateItemAction,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import { selectGroups, selectInfo, selectItems } from './selectors';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.initialize(this.props.match.params.boardId);
  }

  openModal = id => {
    this.props.openModal({ content: this.renderModalItem(id) });
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

  renderDraftItem = ({ disableCreateMode, parentId }) => (
    <DraftItem
      disableCreateMode={disableCreateMode}
      executeBatch={this.props.executeBatch}
      parent={this.props.groups[parentId]}
      parentId={parentId}
      userId={this.props.uid}
    />
  );

  renderGroup = id => {
    const filteredItems = this.filterCollection(this.props.items, 'parent', id);
    return (
      <Group
        createItem={this.createItem}
        executeBatch={this.props.executeBatch}
        group={this.props.groups[id]}
        id={id}
        items={filteredItems}
        key={id}
        renderDraftItem={this.renderDraftItem}
        renderItem={this.renderItem}
        updateGroup={this.props.updateGroup}
        userId={this.props.uid}
      />
    );
  };

  renderModalItem = id => {
    const item = this.props.items[id];
    return (
      <ModalContainer>
        <Item
          closeModal={this.props.closeModal}
          group={this.props.groups[item.parent]}
          id={id}
          item={item}
          showPopup={false}
          showShadow
          updateItem={this.props.updateItem}
        />
      </ModalContainer>
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
              executeBatch={this.props.executeBatch}
              group={this.props.groups[item.parent]}
              id={id}
              item={item}
              openModal={this.openModal}
              updateItem={this.props.updateItem}
            />
          </div>
        )}
      </Draggable>
    );
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
              placeholder={intl.formatMessage(messages.title)}
              updateBoard={this.props.updateBoard}
              value={title}
            />
            <Subtitle
              placeholder={intl.formatMessage(messages.subtitle)}
              updateBoard={this.props.updateBoard}
              value={subtitle}
            />
          </Container>
        </Section>
        <Section style={{ paddingTop: 0 }}>
          <Container>
            <Columns>
              {renderListV2(groups, info.first, this.renderGroup)}
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
  executeBatch: PropTypes.func,
  groups: PropTypes.object,
  info: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.object,
  openModal: PropTypes.func,
  updateBoard: PropTypes.func,
  updateGroup: PropTypes.func,
  updateItem: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  groups: selectGroups(),
  info: selectInfo(),
  items: selectItems(),
  uid: selectUID(),
});

export const mapDispatchToProps = dispatch => ({
  closeModal: params => dispatch(closeModalAction(params)),
  executeBatch: params => dispatch(executeBatchAction.request(params)),
  initialize: params => dispatch(initializeAction.request(params)),
  openModal: params => dispatch(openModalAction(params)),
  updateBoard: params => dispatch(updateBoardAction.request(params)),
  updateGroup: params => dispatch(updateGroupAction.request(params)),
  updateItem: params => dispatch(updateItemAction.request(params)),
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
