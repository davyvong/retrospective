import { call, put, select, take } from 'redux-saga/effects';

import { selectUID } from 'containers/AuthProvider/selectors';

import { createDocumentChannel, createCollectionChannel } from './channels';

import {
  onBoardSnapshot,
  onCommentSnapshot,
  onGroupSnapshot,
  onItemSnapshot,
  onVoteSnapshot,
} from './actions';

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

export function* commentCollectionListener() {
  const id = yield select(selectBoardId());
  yield call(
    createListener,
    createCollectionChannel,
    `boards/${id}/comments`,
    onCommentSnapshot,
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

export function* voteDocumentListener() {
  const id = yield select(selectBoardId());
  const uid = yield select(selectUID());
  yield call(
    createListener,
    createDocumentChannel,
    `boards/${id}/votes/${uid}`,
    onVoteSnapshot,
  );
}
