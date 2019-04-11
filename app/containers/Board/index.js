import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';

import { Draggable } from 'react-beautiful-dnd';

import Columns from 'components/Board/Columns';
import Group from 'components/Board/Group';
import Item from 'components/Board/Item';
import NewItem from 'components/Board/NewItem';
import Subtitle from 'components/Board/Subtitle';
import Title from 'components/Board/Title';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';
import SmallContainer from 'components/Bulma/SmallContainer';
import FullScreen from 'components/FullScreen';
import Spinner from 'components/Spinner';

import {
  closeModal as closeModalAction,
  openModal as openModalAction,
} from 'containers/Modal/actions';
import { selectAuthUID } from 'containers/AuthProvider/selectors';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { isType } from 'utils/validate';

import {
  initializeBoard as initializeBoardAction,
  updateBoardGroup as updateBoardGroupAction,
  updateBoardInfo as updateBoardInfoAction,
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

  createItem = ({ groupId }) => {
    this.props.openModal({
      content: (
        <SmallContainer>
          <NewItem
            authorId={this.props.uid}
            closeModal={this.props.closeModal}
            group={this.props.groups[groupId]}
            groupId={groupId}
            saveBoardItem={this.updateBoardItem}
          />
        </SmallContainer>
      ),
    });
  };

  openItem = id => {
    const item = this.props.items[id];
    this.props.openModal({
      content: (
        <SmallContainer>
          <Item
            closeModal={this.props.closeModal}
            group={this.props.groups[item.groupId]}
            id={id}
            item={item}
            onChange={this.updateBoardItem}
            showPopup={false}
            showShadow
          />
        </SmallContainer>
      ),
    });
  };

  filterCollection = (collection, key, value) =>
    Object.keys(collection).filter(id => collection[id][key] === value);

  renderGroup = id => (
    <Group
      createItem={this.createItem}
      group={this.props.groups[id]}
      id={id}
      items={this.filterCollection(this.props.items, 'groupId', id)}
      key={id}
      onChange={this.updateBoardGroup}
      openItem={this.openItem}
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
            group={this.props.groups[this.props.items[id].groupId]}
            id={id}
            item={this.props.items[id]}
            onChange={this.updateBoardItem}
            openItem={this.openItem}
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

  updateBoardGroup = doc => {
    this.props.updateBoardGroup(doc);
  };

  updateBoardInfo = data => {
    this.props.updateBoardInfo({ data });
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
    const { groups, intl } = this.props;
    return (
      <Section>
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
  closeModal: PropTypes.func,
  groups: PropTypes.object,
  info: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.object,
  openModal: PropTypes.func,
  updateBoardGroup: PropTypes.func,
  updateBoardInfo: PropTypes.func,
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
  updateBoardGroup: params => dispatch(updateBoardGroupAction.request(params)),
  updateBoardInfo: params => dispatch(updateBoardInfoAction.request(params)),
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
