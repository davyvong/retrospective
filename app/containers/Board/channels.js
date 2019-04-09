import { eventChannel } from 'redux-saga';
import { firestore } from 'configureFirebase';

export function createDocumentChannel(collectionId, documentId) {
  return eventChannel(emitter => {
    const unsubscribe = firestore
      .collection(collectionId)
      .doc(documentId)
      .onSnapshot(snapshot => {
        emitter({
          id: snapshot.id,
          data: snapshot.data() || {},
        });
      });
    return unsubscribe;
  });
}

export function createSubCollectionChannel(
  collectionId,
  documentId,
  subCollectionId,
) {
  return eventChannel(emitter => {
    const unsubscribe = firestore
      .collection(collectionId)
      .doc(documentId)
      .collection(subCollectionId)
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
