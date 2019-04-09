import { call, put, select, take } from 'redux-saga/effects';

import { createDocumentChannel, createSubCollectionChannel } from './channels';

import {
  boardSnapshot,
  boardGroupAdded,
  boardGroupModified,
  boardGroupDeleted,
  boardItemAdded,
  boardItemModified,
  boardItemDeleted,
} from './actions';

import { CHANGE_TYPES } from './constants';

import { selectBoardId } from './selectors';

export function* createDocumentListener(collectionId, documentId, action) {
  const channel = yield call(createDocumentChannel, collectionId, documentId);
  try {
    while (true) {
      const doc = yield take(channel);
      if (doc && action) {
        yield put(action(doc));
      }
    }
  } finally {
    //
  }
}

export function* createSubCollectionListener(
  collectionId,
  documentId,
  subCollectionId,
  actions,
) {
  const channel = yield call(
    createSubCollectionChannel,
    collectionId,
    documentId,
    subCollectionId,
  );
  try {
    while (true) {
      const doc = yield take(channel);
      if (doc.type === CHANGE_TYPES.ADDED) {
        if (actions[CHANGE_TYPES.ADDED]) {
          yield put(actions[CHANGE_TYPES.ADDED](doc));
        }
      } else if (doc.type === CHANGE_TYPES.MODIFIED) {
        if (actions[CHANGE_TYPES.MODIFIED]) {
          yield put(actions[CHANGE_TYPES.MODIFIED](doc));
        }
      } else if (doc.type === CHANGE_TYPES.DELETED) {
        if (actions[CHANGE_TYPES.DELETED]) {
          yield put(actions[CHANGE_TYPES.DELETED](doc));
        }
      }
    }
  } finally {
    //
  }
}

export function* boardInfoListener() {
  const id = yield select(selectBoardId());
  yield call(createDocumentListener, 'boards', id, boardSnapshot);
}

export function* boardGroupListener() {
  const id = yield select(selectBoardId());
  yield call(createSubCollectionListener, 'boards', id, 'groups', {
    [CHANGE_TYPES.ADDED]: boardGroupAdded,
    [CHANGE_TYPES.MODIFIED]: boardGroupModified,
    [CHANGE_TYPES.DELETED]: boardGroupDeleted,
  });
}

export function* boardItemListener() {
  const id = yield select(selectBoardId());
  yield call(createSubCollectionListener, 'boards', id, 'items', {
    [CHANGE_TYPES.ADDED]: boardItemAdded,
    [CHANGE_TYPES.MODIFIED]: boardItemModified,
    [CHANGE_TYPES.DELETED]: boardItemDeleted,
  });
}
