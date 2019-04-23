const functions = require('firebase-functions');

const firestore = require('../firestore.js');

module.exports = functions.firestore
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
