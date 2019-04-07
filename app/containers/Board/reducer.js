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
      return setBoardItem(state, action);
    case BOARD_ITEM_MODIFIED:
      return setBoardItem(state, action);
    case BOARD_ITEM_DELETED:
      return deleteBoardItem(state, action);
    default:
      return state;
  }
}

function setBoardItem(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: doc } = action;
    if (
      isType(doc, 'Object') &&
      isType(doc.data, 'Object') &&
      isGUID(doc.id, 'String')
    ) {
      return state.setIn(['items', doc.id], {
        ...doc.data,
        id: doc.id,
      });
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
