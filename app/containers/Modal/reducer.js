import React from 'react';
import { fromJS } from 'immutable';

import { isType } from 'utils/validate';

import { CLOSE_MODAL, OPEN_MODAL } from './constants';

export const initialState = fromJS({
  closeOnBackdrop: true,
  content: null,
  onClose: null,
  visible: false,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return initialState;
    case OPEN_MODAL:
      return openModal(state, action);
    default:
      return state;
  }
}

function openModal(state, action) {
  if (isType(action.params, 'Object')) {
    const { params: modal } = action;
    const newState = { visible: true };
    if (isType(modal.closeOnBackdrop, 'Boolean')) {
      newState.closeOnBackdrop = modal.closeOnBackdrop;
    }
    if (isType(modal.onClose, 'Function')) {
      newState.onClose = modal.onClose;
    }
    if (React.isValidElement(modal.content)) {
      newState.content = modal.content;
    }
    return state.merge(newState);
  }
  return state;
}

export default reducer;
