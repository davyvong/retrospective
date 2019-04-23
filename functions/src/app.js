const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const accountCleanup = require('./cron/accountCleanup.js');

// https://us-central1-retrospective-7fdad.cloudfunctions.net/accountCleanup
exports.accountCleanup = functions.https.onRequest((request, response) => {
  accountCleanup();
  response.status(200).json({ message: 'function: accountCleanup executed' });
});

exports.onDeleteComment = require('./triggers/onDeleteComment.js');
exports.onDeleteGroup = require('./triggers/onDeleteGroup.js');
exports.onDeleteItem = require('./triggers/onDeleteItem.js');
