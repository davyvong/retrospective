import { call, put, select, take } from 'redux-saga/effects';

import { CHANGE_TYPES } from 'firebase/constants';

import { createDocumentChannel, createCollectionChannel } from './channels';

import {
  boardSnapshot,
  boardGroupAdded,
  boardGroupModified,
  boardGroupRemoved,
  boardItemAdded,
  boardItemModified,
  boardItemRemoved,
} from './actions';

import { selectBoardId } from './selectors';

export function* createCollectionListener(path, actions) {
  const channel = yield call(createCollectionChannel, path);
  try {
    while (true) {
      const doc = yield take(channel);
      if (doc.change === CHANGE_TYPES.ADDED) {
        if (actions[CHANGE_TYPES.ADDED]) {
          yield put(actions[CHANGE_TYPES.ADDED](doc));
        }
      } else if (doc.change === CHANGE_TYPES.MODIFIED) {
        if (actions[CHANGE_TYPES.MODIFIED]) {
          yield put(actions[CHANGE_TYPES.MODIFIED](doc));
        }
      } else if (doc.change === CHANGE_TYPES.REMOVED) {
        if (actions[CHANGE_TYPES.REMOVED]) {
          yield put(actions[CHANGE_TYPES.REMOVED](doc));
        }
      }
    }
  } finally {
    //
  }
}

export function* createDocumentListener(path, action) {
  const channel = yield call(createDocumentChannel, path);
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

export function* boardInfoListener() {
  const id = yield select(selectBoardId());
  yield call(createDocumentListener, `boards/${id}`, boardSnapshot);
}

export function* boardGroupListener() {
  const id = yield select(selectBoardId());
  yield call(createCollectionListener, `boards/${id}/groups`, {
    [CHANGE_TYPES.ADDED]: boardGroupAdded,
    [CHANGE_TYPES.MODIFIED]: boardGroupModified,
    [CHANGE_TYPES.REMOVED]: boardGroupRemoved,
  });
}

export function* boardItemListener() {
  const id = yield select(selectBoardId());
  yield call(createCollectionListener, `boards/${id}/items`, {
    [CHANGE_TYPES.ADDED]: boardItemAdded,
    [CHANGE_TYPES.MODIFIED]: boardItemModified,
    [CHANGE_TYPES.REMOVED]: boardItemRemoved,
  });
}
