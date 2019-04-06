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
    case BOARD_ITEM_ADDED: {
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
    case BOARD_ITEM_MODIFIED:
      return state;
    case BOARD_ITEM_DELETED:
      return state;
    default:
      return state;
  }
}

export default reducer;
