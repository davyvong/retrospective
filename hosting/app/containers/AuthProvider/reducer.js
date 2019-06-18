import { fromJS } from 'immutable';

import { isType } from 'utils/validators';

import { SET_AUTH_UID } from './constants';

export const initialState = fromJS({
  uid: null,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH_UID:
      return setAuthUID(state, action);
    default:
      return state;
  }
}

function setAuthUID(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: user } = action;
    if (isType(user.uid, 'String')) {
      return state.set('uid', user.uid);
    }
  }
  return state;
}

export default reducer;
