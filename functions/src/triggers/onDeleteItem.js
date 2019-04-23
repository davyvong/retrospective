const functions = require('firebase-functions');

const firestore = require('../firestore.js');

module.exports = functions.firestore
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
