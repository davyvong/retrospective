import { call, fork } from 'redux-saga/effects';

import {
  boardSnapshot,
  boardGroupAdded,
  boardGroupModified,
  boardGroupDeleted,
  boardItemAdded,
  boardItemModified,
  boardItemDeleted,
} from './actions';

import { CHANGE_TYPES } from './constants';

import {
  createDocumentListener,
  createSubCollectionListener,
} from './listeners';

export function* boardInfoListener() {
  yield call(
    createDocumentListener,
    'boards',
    'd9965f7c-0437-4bc3-8647-40e313058fee',
    boardSnapshot,
  );
}

function* boardGroupListener() {
  yield call(
    createSubCollectionListener,
    'boards',
    'd9965f7c-0437-4bc3-8647-40e313058fee',
    'groups',
    {
      [CHANGE_TYPES.ADDED]: boardGroupAdded,
      [CHANGE_TYPES.MODIFIED]: boardGroupModified,
      [CHANGE_TYPES.DELETED]: boardGroupDeleted,
    },
  );
}

function* boardItemListener() {
  yield call(
    createSubCollectionListener,
    'boards',
    'd9965f7c-0437-4bc3-8647-40e313058fee',
    'items',
    {
      [CHANGE_TYPES.ADDED]: boardItemAdded,
      [CHANGE_TYPES.MODIFIED]: boardItemModified,
      [CHANGE_TYPES.DELETED]: boardItemDeleted,
    },
  );
}

export default function* saga() {
  yield fork(boardInfoListener);
  yield fork(boardGroupListener);
  yield fork(boardItemListener);
}
