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
import { COLLECTION_TYPES } from 'firebase/boards/constants';

import {
  initializeBoard as initializeBoardAction,
  updateBoardGroup as updateBoardGroupAction,
  updateBoardInfo as updateBoardInfoAction,
  updateBoardItem as updateBoardItemAction,
  executeBatch as executeBatchAction,
} from './actions';

import {
  INITIALIZE_BOARD,
  UPDATE_BOARD_GROUP,
  UPDATE_BOARD_INFO,
  UPDATE_BOARD_ITEM,
  EXECUTE_BATCH,
} from './constants';

import {
  boardInfoListener,
  boardGroupListener,
  boardItemListener,
} from './listeners';

import { selectBoardId } from './selectors';

export function* initializeBoard(action) {
  try {
    const { params: id } = action;
    const ref = firestore.doc(`boards/${id}`);
    const doc = yield call([ref, ref.get]);
    if (!doc.exists) {
      throw new Error(`Board (${id}) does not exist.`);
    }
    yield put(initializeBoardAction.success(id));
    yield all([
      fork(boardInfoListener),
      fork(boardGroupListener),
      fork(boardItemListener),
    ]);
  } catch (error) {
    yield put(initializeBoardAction.failure(error));
  }
}

export function* updateBoardGroup(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/groups/${doc.id}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateBoardGroupAction.success());
  } catch (error) {
    yield put(updateBoardGroupAction.failure(error));
  }
}

export function* updateBoardInfo(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateBoardInfoAction.success());
  } catch (error) {
    yield put(updateBoardInfoAction.failure(error));
  }
}

export function* updateBoardItem(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/items/${doc.id}`);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateBoardItemAction.success());
  } catch (error) {
    yield put(updateBoardItemAction.failure(error));
  }
}

export function* executeBatch(action) {
  try {
    const { params: queue } = action;
    const boardId = yield select(selectBoardId());
    const batch = yield call([firestore, firestore.batch]);
    queue.forEach(node => {
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
    yield put(executeBatchAction.success());
  } catch (error) {
    yield put(executeBatchAction.failure(error));
  }
}

export default function* saga() {
  yield takeLatest(INITIALIZE_BOARD.REQUEST, initializeBoard);
  yield takeEvery(UPDATE_BOARD_GROUP.REQUEST, updateBoardGroup);
  yield takeEvery(UPDATE_BOARD_INFO.REQUEST, updateBoardInfo);
  yield takeEvery(UPDATE_BOARD_ITEM.REQUEST, updateBoardItem);
  yield takeEvery(EXECUTE_BATCH.REQUEST, executeBatch);
}
