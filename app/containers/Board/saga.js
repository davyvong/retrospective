import { eventChannel } from 'redux-saga';
import { call, fork, put, take } from 'redux-saga/effects';

import { firestore } from 'configureFirebase';

import {
  boardSnapshot,
  boardItemAdded,
  boardItemModified,
  boardItemDeleted,
} from './actions';

import { CHANGE_TYPES } from './constants';

function createBoardChannel(boardId) {
  return eventChannel(emitter => {
    const unsubscribe = firestore
      .collection('boards')
      .doc(boardId)
      .onSnapshot(snapshot => {
        emitter({
          id: snapshot.id,
          data: snapshot.data() || {},
        });
      });
    return unsubscribe;
  });
}

export function* boardListener() {
  const channel = yield call(
    createBoardChannel,
    'd9965f7c-0437-4bc3-8647-40e313058fee',
  );
  try {
    while (true) {
      const doc = yield take(channel);
      yield put(boardSnapshot(doc));
    }
  } finally {
    //
  }
}

function createItemChannel(boardId) {
  return eventChannel(emitter => {
    const unsubscribe = firestore
      .collection('boards')
      .doc(boardId)
      .collection('items')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          emitter({
            id: change.doc.id,
            data: change.doc.data() || {},
            type: change.type,
          });
        });
      });
    return unsubscribe;
  });
}

export function* boardItemListener() {
  const channel = yield call(
    createItemChannel,
    'd9965f7c-0437-4bc3-8647-40e313058fee',
  );
  try {
    while (true) {
      const doc = yield take(channel);
      if (doc.type === CHANGE_TYPES.ADDED) {
        yield put(boardItemAdded(doc));
      } else if (doc.type === CHANGE_TYPES.MODIFIED) {
        yield put(boardItemModified(doc));
      } else if (doc.type === CHANGE_TYPES.DELETED) {
        yield put(boardItemDeleted(doc));
      }
    }
  } finally {
    //
  }
}

export default function* saga() {
  yield fork(boardListener);
  yield fork(boardItemListener);
}
