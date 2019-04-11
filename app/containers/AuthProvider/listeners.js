import { call, put, take } from 'redux-saga/effects';
import { isEmpty } from 'lodash';

import { createAuthChannel } from './channels';

import { authorizeAnonymously, setAuthUID } from './actions';

export function* createAuthListener() {
  const channel = yield call(createAuthChannel);
  try {
    while (true) {
      const user = yield take(channel);
      if (!isEmpty(user)) {
        yield put(setAuthUID({ uid: user.uid }));
      } else {
        yield put(authorizeAnonymously.request());
      }
    }
  } finally {
    //
  }
}
