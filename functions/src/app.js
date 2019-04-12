const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const firestore = require('./firestore.js');

exports.onDeleteGroup = functions.firestore
  .document('boards/{boardId}/groups/{groupId}')
  .onDelete(({ context }) => {
    const { boardId, groupId } = context.params;
    return firestore
      .collection(`boards/${boardId}/items`)
      .where('groupId', '==', groupId)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => doc.ref.delete());
        return 0;
      });
  });