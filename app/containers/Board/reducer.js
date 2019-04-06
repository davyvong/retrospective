import { fromJS } from 'immutable';

import { isGUID, isType } from 'utils/validate';

import {
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_DELETED,
} from './constants';

export const initialState = fromJS({
  context: '',
  items: {},
  title: '',
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case BOARD_ITEM_ADDED:
      return boardItemAdded(state, action);
    case BOARD_ITEM_MODIFIED:
      return boardItemModified(state, action);
    case BOARD_ITEM_DELETED:
      return boardItemDeleted(state, action);
    default:
      return state;
  }
}

function boardItemAdded(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (
      isType(doc, 'Object') &&
      isType(doc.data, 'Object') &&
      isGUID(doc.id, 'String')
    ) {
      return state.setIn(['items', doc.id], doc.data);
    }
  }
  return state;
}

function boardItemModified(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (
      isType(doc, 'Object') &&
      isType(doc.data, 'Object') &&
      isGUID(doc.id, 'String')
    ) {
      return state.updateIn(['items', doc.id], value => ({
        ...value,
        ...doc.data,
      }));
    }
  }
  return state;
}

function boardItemDeleted(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (isType(doc, 'Object') && isGUID(doc.id, 'String')) {
      return state.get('items').delete(doc.id);
    }
  }
  return state;
}

export default reducer;
