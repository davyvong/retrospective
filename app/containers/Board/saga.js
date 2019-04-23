import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import uuidv4 from 'uuid/v4';

import { firestore } from 'configureFirebase';

import { ITEM_COLORS } from 'constants/colors';

import { selectUID } from 'containers/AuthProvider/selectors';

import { COLLECTION_TYPES } from 'firebase/constants';
import { insertNodeV2 } from 'firebase/core';
import { constructDoc } from 'firebase/helpers';

import {
  initialize as initializeAction,
  createBoard as createBoardAction,
  updateBoard as updateBoardAction,
  updateComment as updateCommentAction,
  updateGroup as updateGroupAction,
  updateItem as updateItemAction,
  executeBatch as executeBatchAction,
} from './actions';

import {
  INITIALIZE,
  CREATE_BOARD,
  UPDATE_BOARD,
  UPDATE_COMMENT,
  UPDATE_GROUP,
  UPDATE_ITEM,
  EXECUTE_BATCH,
} from './constants';

import {
  boardDocumentListener,
  commentCollectionListener,
  groupCollectionListener,
  itemCollectionListener,
  voteDocumentListener,
} from './listeners';

import { selectBoardId } from './selectors';

export function* initialize(action) {
  try {
    const { params: id } = action;
    const ref = firestore.doc(`boards/${id}`);
    const doc = yield call([ref, ref.get]);
    if (!doc.exists) {
      throw new Error(`Board (${id}) does not exist.`);
    }
    yield put(initializeAction.success(id));
    yield all([
      fork(boardDocumentListener),
      fork(commentCollectionListener),
      fork(groupCollectionListener),
      fork(itemCollectionListener),
      fork(voteDocumentListener),
    ]);
  } catch (error) {
    yield put(initializeAction.failure(error));
  }
}

export function* createBoard() {
  try {
    const queue = [];
    const timestamp = new Date().getTime();
    const boardId = uuidv4();
    const uid = yield select(selectUID());
    const boardNode = constructDoc(
      boardId,
      {
        child: null,
        createdBy: uid,
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
      createdBy: uid,
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
    yield put(executeBatchAction.request([...queue, ...groupBatch]));
    yield put(createBoardAction.success());
  } catch (error) {
    yield put(createBoardAction.failure(error));
  }
}

export function* updateBoard(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateBoardAction.success());
  } catch (error) {
    yield put(updateBoardAction.failure(error));
  }
}

export function* updateComment(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/comments/${doc.id}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateCommentAction.success());
  } catch (error) {
    yield put(updateCommentAction.failure(error));
  }
}

export function* updateGroup(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/groups/${doc.id}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateGroupAction.success());
  } catch (error) {
    yield put(updateGroupAction.failure(error));
  }
}

export function* updateItem(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/items/${doc.id}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateItemAction.success());
  } catch (error) {
    yield put(updateItemAction.failure(error));
  }
}

export function* executeBatch(action) {
  try {
    const { params: queue } = action;
    let boardId = yield select(selectBoardId());
    let redirect = null;
    if (!boardId) {
      redirect = () => window.location.replace(`/board/${boardId}`);
    }
    const batch = yield call([firestore, firestore.batch]);
    queue.forEach(node => {
      if (!boardId && node.collection === COLLECTION_TYPES.BOARDS) {
        boardId = node.id;
      }
      const ref =
        node.collection === COLLECTION_TYPES.BOARDS
          ? firestore.doc(`boards/${boardId}`)
          : firestore.doc(`boards/${boardId}/${node.collection}/${node.id}`);
      if (node.change === 'set') {
        batch.set(ref, node.data, { merge: true });
      } else if (node.change === 'delete') {
        batch.delete(ref);
      }
    });
    yield call([batch, batch.commit]);
    if (redirect) {
      redirect();
    }
    yield put(executeBatchAction.success());
  } catch (error) {
    yield put(executeBatchAction.failure(error));
  }
}

export default function* saga() {
  yield takeLatest(INITIALIZE.REQUEST, initialize);
  yield takeLatest(CREATE_BOARD.REQUEST, createBoard);
  yield takeEvery(UPDATE_BOARD.REQUEST, updateBoard);
  yield takeEvery(UPDATE_COMMENT.REQUEST, updateComment);
  yield takeEvery(UPDATE_GROUP.REQUEST, updateGroup);
  yield takeEvery(UPDATE_ITEM.REQUEST, updateItem);
  yield takeEvery(EXECUTE_BATCH.REQUEST, executeBatch);
}
