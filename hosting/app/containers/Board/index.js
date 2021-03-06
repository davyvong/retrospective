import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import uuidv4 from 'uuid/v4';

import { Draggable } from 'react-beautiful-dnd';

import Comment from 'components/Board/Comment';
import Container from 'components/Board/Container';
import DraftComment from 'components/Board/DraftComment';
import DraftItem from 'components/Board/DraftItem';
import Group from 'components/Board/Group';
import Item from 'components/Board/Item';
import Setting from 'components/Board/Setting';
import Subtitle from 'components/Board/Subtitle';
import Title from 'components/Board/Title';
import Button from 'components/Bulma/Button';
import Columns from 'components/Bulma/Columns';
import Row from 'components/Bulma/Row';
import Section from 'components/Bulma/Section';
import FullScreen from 'components/FullScreen';
import Spinner from 'components/Spinner';

import { ITEM_COLORS } from 'constants/colors';

import { selectUID } from 'containers/AuthProvider/selectors';

import {
  closeModal as closeModalAction,
  openModal as openModalAction,
} from 'containers/Modal/actions';

import { COLLECTION_TYPES } from 'firebase/constants';
import { insertNodeV2, renderListV1 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import deepClone from 'utils/deepClone';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { isGUID, isType } from 'utils/validators';

import {
  executeBatch as executeBatchAction,
  initialize as initializeAction,
  updateBoard as updateBoardAction,
  updateComment as updateCommentAction,
  updateGroup as updateGroupAction,
  updateItem as updateItemAction,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import {
  selectBoardId,
  selectComments,
  selectGroups,
  selectInfo,
  selectItems,
  selectVotes,
} from './selectors';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.initialize(this.props.match.params.boardId);
  }

  calculateLastComment = id => {
    let last = this.props.items[id].first;
    while (
      isGUID(last) &&
      isType(this.props.comments[last], 'Object') &&
      isGUID(this.props.comments[last].next)
    ) {
      last = this.props.comments[last].next;
    }
    return {
      ...this.props.comments[last],
      id: last,
    };
  };

  calculateRemainingVotes = () => {
    const votes = Object.keys(this.props.votes);
    const userVotes = votes.filter(id => isGUID(id));
    const voteCount = userVotes.reduce((acc, id) => {
      if (isType(this.props.items[id], 'Object')) {
        return acc + Math.abs(this.props.votes[id]);
      }
      return acc;
    }, 0);
    return this.props.info.voteLimit - voteCount;
  };

  createColumn = () => {
    const newId = uuidv4();
    const queue = insertNodeV2(
      constructDoc(newId, {
        color: ITEM_COLORS.GREY,
        createdBy: this.props.uid,
        dateCreated: new Date().getTime(),
        first: null,
        name: '',
        parent: this.props.boardId,
      }),
      COLLECTION_TYPES.GROUPS,
      constructDoc(this.props.info.first, { prev: null }),
      false,
    );
    this.props.executeBatch(queue);
  };

  filterCollection = (collection, key, value) => {
    const filteredCollection = deepClone(collection);
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

  renderComment = id => {
    const node = this.props.comments[id];
    return (
      <Comment
        executeBatch={this.props.executeBatch}
        id={id}
        key={id}
        node={node}
        parent={this.props.items[node.parent]}
        placeholder={this.props.intl.formatMessage(messages.commentMessage)}
        updateComment={this.props.updateComment}
        userId={this.props.uid}
      />
    );
  };

  renderDraftComment = ({ parentId }) => (
    <DraftComment
      executeBatch={this.props.executeBatch}
      last={this.calculateLastComment(parentId)}
      parent={this.props.items[parentId]}
      parentId={parentId}
      placeholder={this.props.intl.formatMessage(messages.commentMessage)}
      userId={this.props.uid}
    />
  );

  renderDraftItem = ({ disableCreateMode, parentId }) => (
    <DraftItem
      closeModal={this.props.closeModal}
      disableCreateMode={disableCreateMode}
      executeBatch={this.props.executeBatch}
      openModal={this.props.openModal}
      parent={this.props.groups[parentId]}
      parentId={parentId}
      placeholder={this.props.intl.formatMessage(messages.itemMessage)}
      userId={this.props.uid}
    />
  );

  renderGroup = id => {
    const items = this.filterCollection(this.props.items, 'parent', id);
    return (
      <Group
        boardId={this.props.boardId}
        closeModal={this.props.closeModal}
        createItem={this.createItem}
        executeBatch={this.props.executeBatch}
        id={id}
        items={items}
        key={id}
        node={this.props.groups[id]}
        openModal={this.props.openModal}
        placeholder={this.props.intl.formatMessage(messages.groupName)}
        renderDraftItem={this.renderDraftItem}
        renderItem={this.renderItem}
        updateGroup={this.props.updateGroup}
        userId={this.props.uid}
      />
    );
  };

  renderItem = (id, index) => {
    const node = this.props.items[id];
    if (!node) {
      return null;
    }
    const userVotes = this.props.votes[id] || 0;
    return (
      <Draggable draggableId={id} key={id} index={index}>
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Item
              closeModal={this.props.closeModal}
              comments={this.props.comments}
              executeBatch={this.props.executeBatch}
              id={id}
              node={node}
              openModal={this.props.openModal}
              parent={this.props.groups[node.parent]}
              placeholder={this.props.intl.formatMessage(messages.itemMessage)}
              remainingVotes={this.calculateRemainingVotes()}
              renderComment={this.renderComment}
              renderDraftComment={this.renderDraftComment}
              updateItem={this.props.updateItem}
              userId={this.props.uid}
              userVotes={userVotes}
            />
          </div>
        )}
      </Draggable>
    );
  };

  updateSubtitle = update => {
    if (isType(update, 'Object') && isType(update.value, 'String')) {
      this.props.updateBoard(
        constructDoc(undefined, { subtitle: update.value }),
      );
    }
  };

  updateTitle = update => {
    if (isType(update, 'Object') && isType(update.value, 'String')) {
      this.props.updateBoard(constructDoc(undefined, { title: update.value }));
    }
  };

  updateVotesPerUser = update => {
    if (isType(update, 'Object')) {
      const updateInt = parseInt(update.value, 10);
      if (!Number.isNaN(updateInt)) {
        this.props.updateBoard(
          constructDoc(undefined, { voteLimit: updateInt }),
        );
      }
    }
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
        <Section style={{ paddingBottom: '1rem' }}>
          <Container>
            <Title
              placeholder={intl.formatMessage(messages.title)}
              update={this.updateTitle}
              value={title}
            />
            <Subtitle
              placeholder={intl.formatMessage(messages.subtitle)}
              update={this.updateSubtitle}
              value={subtitle}
            />
            <Row>
              <Setting
                prefix="Votes per user:"
                update={this.updateVotesPerUser}
                value={info.voteLimit}
              />
              <Setting
                disabled
                prefix="Votes remaining:"
                value={this.calculateRemainingVotes()}
              />
            </Row>
          </Container>
        </Section>
        <Section style={{ paddingTop: 0 }}>
          <Container>
            {Object.keys(groups).length === 0 && (
              <Button onClick={this.createColumn}>Create a column</Button>
            )}
            <Columns>
              {renderListV1(groups, info.first, this.renderGroup)}
            </Columns>
          </Container>
        </Section>
      </div>
    );
  }
}

Component.defaultProps = {
  comments: {},
  groups: {},
  info: {},
  items: {},
  votes: {},
};

Component.propTypes = {
  boardId: PropTypes.string,
  closeModal: PropTypes.func,
  comments: PropTypes.object,
  executeBatch: PropTypes.func,
  groups: PropTypes.object,
  info: PropTypes.object,
  intl: intlShape.isRequired,
  items: PropTypes.object,
  openModal: PropTypes.func,
  updateBoard: PropTypes.func,
  updateComment: PropTypes.func,
  updateGroup: PropTypes.func,
  updateItem: PropTypes.func,
  votes: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  boardId: selectBoardId(),
  comments: selectComments(),
  groups: selectGroups(),
  info: selectInfo(),
  items: selectItems(),
  uid: selectUID(),
  votes: selectVotes(),
});

export const mapDispatchToProps = dispatch => ({
  closeModal: params => dispatch(closeModalAction(params)),
  executeBatch: params => dispatch(executeBatchAction.request(params)),
  initialize: params => dispatch(initializeAction.request(params)),
  openModal: params => dispatch(openModalAction(params)),
  updateBoard: params => dispatch(updateBoardAction.request(params)),
  updateComment: params => dispatch(updateCommentAction.request(params)),
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
