import { call, put, take } from 'redux-saga/effects';

import { createDocumentChannel, createSubCollectionChannel } from './channels';

import { CHANGE_TYPES } from './constants';

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
