import { fromJS } from 'immutable';

import { isGUID, isType } from 'utils/validators';

import {
  BOARD_SNAPSHOT,
  BOARD_GROUP_ADDED,
  BOARD_GROUP_MODIFIED,
  BOARD_GROUP_REMOVED,
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_REMOVED,
  INITIALIZE_BOARD,
} from './constants';

export const initialState = fromJS({
  id: '',
  info: {},
  items: {},
  groups: {},
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case BOARD_SNAPSHOT:
      return setBoardInfo(state, action);
    case BOARD_GROUP_ADDED:
      return setBoardGroup(state, action);
    case BOARD_GROUP_MODIFIED:
      return setBoardGroup(state, action);
    case BOARD_GROUP_REMOVED:
      return removeBoardGroup(state, action);
    case BOARD_ITEM_ADDED:
      return setBoardItem(state, action);
    case BOARD_ITEM_MODIFIED:
      return setBoardItem(state, action);
    case BOARD_ITEM_REMOVED:
      return removeBoardItem(state, action);
    case INITIALIZE_BOARD.SUCCESS:
      return initializeBoard(state, action);
    default:
      return state;
  }
}

function setBoardInfo(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      return state.set('info', fromJS(doc.data));
    }
  }
  return state;
}

function setBoardGroup(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      return state.setIn(['groups', doc.id], doc.data);
    }
  }
  return state;
}

function removeBoardGroup(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc, 'Object') && isGUID(doc.id)) {
      return state.set('groups', state.get('groups').delete(doc.id));
    }
  }
  return state;
}

function setBoardItem(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      return state.setIn(['items', doc.id], doc.data);
    }
  }
  return state;
}

function removeBoardItem(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc, 'Object') && isGUID(doc.id)) {
      return state.set('items', state.get('items').delete(doc.id));
    }
  }
  return state;
}

function initializeBoard(state, action) {
  const { payload: id } = action;
  if (isGUID(id)) {
    return state.set('id', id);
  }
  return state;
}

export default reducer;
