const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore = require('./firestore.js');

exports.onDeleteGroup = functions.firestore
  .document('boards/{boardId}/groups/{groupId}')
  .onDelete((snap, context) => {
    const { boardId, groupId } = context.params;
    return Promise.all([
      firestore
        .collection(`boards/${boardId}/items`)
        .where('parent', '==', groupId)
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete())),
    ]).then(() => 0);
  });

exports.onDeleteItem = functions.firestore
  .document('boards/{boardId}/items/{itemId}')
  .onDelete((snap, context) => {
    const { boardId, itemId } = context.params;
    return Promise.all([
      firestore
        .collection(`boards/${boardId}/comments`)
        .where('parent', '==', itemId)
        .get()
        .then(querySnapshot => querySnapshot.forEach(doc => doc.ref.delete())),
    ]).then(() => 0);
  });

exports.onDeleteComment = functions.firestore
  .document('boards/{boardId}/comments/{commentId}')
  .onDelete((snap, context) => {
    const { boardId } = context.params;
    const data = snap.data() || {};
    return Promise.all([
      firestore
        .document(`boards/${boardId}/items/${data.parent}`)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return 0;
          }
          return doc.ref.runTransaction(transaction =>
            transaction.get(doc.ref).then(tDoc => {
              const tData = tDoc.data() || {};
              if (tDoc.exists) {
                transaction.update({ comments: tData.comments - 1 });
              }
            }),
          );
        }),
    ]).then(() => 0);
  });
