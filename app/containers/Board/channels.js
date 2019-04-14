import { eventChannel } from 'redux-saga';
import { firestore } from 'configureFirebase';

export function createDocumentChannel(path) {
  return eventChannel(emitter => {
    const unsubscribe = firestore.doc(path).onSnapshot(snapshot => {
      emitter({
        id: snapshot.id,
        data: snapshot.data() || {},
      });
    });
    return unsubscribe;
  });
}

export function createCollectionChannel(path) {
  return eventChannel(emitter => {
    const unsubscribe = firestore.collection(path).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        emitter({
          id: change.doc.id,
          change: change.type,
          data: change.doc.data() || {},
        });
      });
    });
    return unsubscribe;
  });
}
