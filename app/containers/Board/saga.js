import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { firestore } from 'configureFirebase';

import {
  initializeBoard as initializeBoardAction,
  updateBoardInfo as updateBoardInfoAction,
} from './actions';

import { INITIALIZE_BOARD, UPDATE_BOARD_INFO } from './constants';

import {
  boardInfoListener,
  boardGroupListener,
  boardItemListener,
} from './listeners';

export function* initializeBoard(action) {
  try {
    const { params: id } = action;
    const ref = firestore.collection('boards').doc(id);
    const doc = yield call([ref, ref.get]);
    if (!doc.exists) {
      throw new Error('Board does not exist.');
    }
    yield put(initializeBoardAction.success(id));
    yield fork(boardInfoListener);
    yield fork(boardGroupListener);
    yield fork(boardItemListener);
  } catch (error) {
    yield put(initializeBoardAction.failure(error));
  }
}

export function* updateBoardInfo(action) {
  try {
    const { params: doc } = action;
    const ref = firestore.collection('boards').doc(doc.id);
    yield call([ref, ref.set], doc.data, { merge: true });
    yield put(updateBoardInfoAction.success());
  } catch (error) {
    yield put(updateBoardInfoAction.failure(error));
  }
}

export default function* saga() {
  yield takeLatest(INITIALIZE_BOARD.REQUEST, initializeBoard);
  yield takeLatest(UPDATE_BOARD_INFO.REQUEST, updateBoardInfo);
}
