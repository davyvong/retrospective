import { eventChannel } from 'redux-saga';
import { auth } from 'configureFirebase';

export function createAuthChannel() {
  return eventChannel(emitter => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      emitter(user || {});
    });
    return unsubscribe;
  });
}
