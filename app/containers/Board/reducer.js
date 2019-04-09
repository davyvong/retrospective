import { fromJS } from 'immutable';

import { isGUID, isType } from 'utils/validate';

import {
  BOARD_SNAPSHOT,
  BOARD_GROUP_ADDED,
  BOARD_GROUP_MODIFIED,
  BOARD_GROUP_DELETED,
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_DELETED,
} from './constants';

export const initialState = fromJS({
  context: '',
  groups: {},
  items: {},
  title: '',
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case BOARD_SNAPSHOT:
      return setBoardInfo(state, action);
    case BOARD_GROUP_ADDED:
      return setBoardGroup(state, action);
    case BOARD_GROUP_MODIFIED:
      return setBoardGroup(state, action);
    case BOARD_GROUP_DELETED:
      return deleteBoardGroup(state, action);
    case BOARD_ITEM_ADDED:
      return setBoardItem(state, action);
    case BOARD_ITEM_MODIFIED:
      return setBoardItem(state, action);
    case BOARD_ITEM_DELETED:
      return deleteBoardItem(state, action);
    default:
      return state;
  }
}

function setBoardInfo(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id, 'String')) {
      return state.merge(doc.data);
    }
  }
  return state;
}

function setBoardGroup(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id, 'String')) {
      return state.setIn(['groups', doc.id], doc.data);
    }
  }
  return state;
}

function deleteBoardGroup(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc, 'Object') && isGUID(doc.id, 'String')) {
      return state.get('groups').delete(doc.id);
    }
  }
  return state;
}

function setBoardItem(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id, 'String')) {
      return state.setIn(['items', doc.id], doc.data);
    }
  }
  return state;
}

function deleteBoardItem(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc, 'Object') && isGUID(doc.id, 'String')) {
      return state.get('items').delete(doc.id);
    }
  }
  return state;
}

export default reducer;
