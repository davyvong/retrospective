import { fromJS } from 'immutable';

import { isGUID, isType } from 'utils/validators';

import {
  BOARD_SNAPSHOT,
  GROUP_SNAPSHOT,
  ITEM_SNAPSHOT,
  INITIALIZE,
} from './constants';

export const initialState = fromJS({
  id: '',
  info: {},
  items: {},
  groups: {},
});

function reducer(state = initialState, action) {
  console.log(action); // eslint-disable-line no-console
  switch (action.type) {
    case INITIALIZE.SUCCESS:
      return initialize(state, action);
    case BOARD_SNAPSHOT:
      return onBoardSnapshot(state, action);
    case GROUP_SNAPSHOT:
      return onGroupSnapshot(state, action);
    case ITEM_SNAPSHOT:
      return onItemSnapshot(state, action);
    default:
      return state;
  }
}

function initialize(state, action) {
  const { payload: id } = action;
  if (isGUID(id)) {
    return state.set('id', id);
  }
  return state;
}

function onBoardSnapshot(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      return state.set('info', fromJS(doc.data));
    }
  }
  return state;
}

function onGroupSnapshot(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      if (doc.change === 'added' || doc.change === 'modified') {
        return state.setIn(['groups', doc.id], doc.data);
      }
      if (doc.change === 'removed') {
        return state.set('groups', state.get('groups').delete(doc.id));
      }
    }
  }
  return state;
}

function onItemSnapshot(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc.data, 'Object') && isGUID(doc.id)) {
      if (doc.change === 'added' || doc.change === 'modified') {
        return state.setIn(['items', doc.id], doc.data);
      }
      if (doc.change === 'removed') {
        return state.set('items', state.get('items').delete(doc.id));
      }
    }
  }
  return state;
}

export default reducer;
