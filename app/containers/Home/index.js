import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import uuidv4 from 'uuid/v4';

import Button from 'components/Bulma/Button';
import Container from 'components/Bulma/Container';
import Section from 'components/Bulma/Section';

import { ITEM_COLORS } from 'constants/colors';

import { selectUID } from 'containers/AuthProvider/selectors';
import { executeBatch as executeBatchAction } from 'containers/Board/actions';
import reducer from 'containers/Board/reducer';
import saga from 'containers/Board/saga';

import { COLLECTION_TYPES } from 'firebase/constants';
import { insertNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import messages from './messages';

class Component extends React.PureComponent {
  createBoard = () => {
    const queue = [];
    const timestamp = new Date().getTime();
    const boardId = uuidv4();
    const boardNode = constructDoc(
      boardId,
      {
        child: null,
        createdBy: this.props.uid,
        dateCreated: timestamp,
        subtitle: '',
        title: '',
        voteLimit: 10,
      },
      COLLECTION_TYPES.BOARDS,
    );
    queue.push(boardNode);
    const groupId = uuidv4();
    const groupNode = constructDoc(groupId, {
      color: ITEM_COLORS.GREY,
      createdBy: this.props.uid,
      dateCreated: timestamp,
      child: null,
      name: '',
      parent: boardId,
    });
    const groupBatch = insertNodeV2(
      groupNode,
      COLLECTION_TYPES.GROUPS,
      constructDoc(boardNode.child, { prev: null }),
    );
    this.props.executeBatch([...queue, ...groupBatch]);
  };

  render() {
    return (
      <Section>
        <Container>
          <h1>
            <FormattedMessage {...messages.title} />
          </h1>
          <Button onClick={this.createBoard}>
            <FormattedMessage {...messages.create} />
          </Button>
        </Container>
      </Section>
    );
  }
}

Component.defaultProps = {
  executeBatch: () => {},
};

Component.propTypes = {
  executeBatch: PropTypes.func,
  uid: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  uid: selectUID(),
});

export const mapDispatchToProps = dispatch => ({
  executeBatch: params => dispatch(executeBatchAction.request(params)),
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
)(Component);
