import { call, put, select, take } from 'redux-saga/effects';

import { createDocumentChannel, createCollectionChannel } from './channels';

import { onBoardSnapshot, onGroupSnapshot, onItemSnapshot } from './actions';

import { selectBoardId } from './selectors';

export function* createListener(channelCreator, path, action) {
  const channel = yield call(channelCreator, path);
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

export function* boardDocumentListener() {
  const id = yield select(selectBoardId());
  yield call(
    createListener,
    createDocumentChannel,
    `boards/${id}`,
    onBoardSnapshot,
  );
}

export function* groupCollectionListener() {
  const id = yield select(selectBoardId());
  yield call(
    createListener,
    createCollectionChannel,
    `boards/${id}/groups`,
    onGroupSnapshot,
  );
}

export function* itemCollectionListener() {
  const id = yield select(selectBoardId());
  yield call(
    createListener,
    createCollectionChannel,
    `boards/${id}/items`,
    onItemSnapshot,
  );
}
