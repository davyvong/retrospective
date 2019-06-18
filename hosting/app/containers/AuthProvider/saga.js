import { call, fork, put, takeLatest } from 'redux-saga/effects';

import { auth } from 'configureFirebase';

import { voteDocumentListener } from 'containers/Board/listeners';

import {
  authorizeAnonymously as authorizeAnonymouslyAction,
  setAuthUID as setAuthUIDAction,
} from './actions';
import { AUTHORIZE_ANONYMOUSLY, SET_AUTH_UID } from './constants';
import { createAuthListener } from './listeners';

export function* authorizeAnonymously() {
  try {
    const user = yield call([auth, auth.signInAnonymously]);
    yield put(setAuthUIDAction({ uid: user.uid }));
    yield put(authorizeAnonymouslyAction.success());
  } catch (error) {
    yield put(authorizeAnonymouslyAction.failure(error));
  }
}

export default function* saga() {
  yield fork(createAuthListener);
  yield takeLatest(AUTHORIZE_ANONYMOUSLY.REQUEST, authorizeAnonymously);
  yield takeLatest(SET_AUTH_UID, voteDocumentListener);
}
