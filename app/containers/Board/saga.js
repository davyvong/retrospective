import {
  all,
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import { firestore } from 'configureFirebase';
import { COLLECTION_TYPES } from 'firebase/constants';

import {
  initialize as initializeAction,
  updateBoard as updateBoardAction,
  updateComment as updateCommentAction,
  updateGroup as updateGroupAction,
  updateItem as updateItemAction,
  executeBatch as executeBatchAction,
} from './actions';

import {
  INITIALIZE,
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
  yield takeEvery(UPDATE_BOARD.REQUEST, updateBoard);
  yield takeEvery(UPDATE_COMMENT.REQUEST, updateComment);
  yield takeEvery(UPDATE_GROUP.REQUEST, updateGroup);
  yield takeEvery(UPDATE_ITEM.REQUEST, updateItem);
  yield takeEvery(EXECUTE_BATCH.REQUEST, executeBatch);
}
