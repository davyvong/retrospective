const functions = require('firebase-functions');

const firestore = require('../firestore.js');

module.exports = functions.firestore
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
