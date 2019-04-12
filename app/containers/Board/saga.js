import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { firestore } from 'configureFirebase';

import {
  initializeBoard as initializeBoardAction,
  removeBoardGroup as removeBoardGroupAction,
  updateBoardGroup as updateBoardGroupAction,
  updateBoardInfo as updateBoardInfoAction,
  removeBoardItem as removeBoardItemAction,
  updateBoardItem as updateBoardItemAction,
} from './actions';

import {
  INITIALIZE_BOARD,
  REMOVE_BOARD_GROUP,
  UPDATE_BOARD_GROUP,
  UPDATE_BOARD_INFO,
  REMOVE_BOARD_ITEM,
  UPDATE_BOARD_ITEM,
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
      throw new Error('Board does not exist.');
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

export function* removeBoardGroup(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/groups/${doc.id}`);
    yield call([ref, ref.delete]);
    yield put(removeBoardGroupAction.success());
  } catch (error) {
    yield put(removeBoardGroupAction.failure(error));
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

export function* removeBoardItem(action) {
  try {
    const { params: doc } = action;
    const boardId = yield select(selectBoardId());
    const ref = firestore.doc(`boards/${boardId}/items/${doc.id}`);
    yield call([ref, ref.delete]);
    yield put(removeBoardItemAction.success());
  } catch (error) {
    yield put(removeBoardItemAction.failure(error));
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

export default function* saga() {
  yield takeLatest(INITIALIZE_BOARD.REQUEST, initializeBoard);
  yield takeLatest(REMOVE_BOARD_GROUP.REQUEST, removeBoardGroup);
  yield takeLatest(UPDATE_BOARD_GROUP.REQUEST, updateBoardGroup);
  yield takeLatest(UPDATE_BOARD_INFO.REQUEST, updateBoardInfo);
  yield takeLatest(REMOVE_BOARD_ITEM.REQUEST, removeBoardItem);
  yield takeLatest(UPDATE_BOARD_ITEM.REQUEST, updateBoardItem);
}
