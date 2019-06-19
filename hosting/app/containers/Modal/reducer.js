import React from 'react';
import { fromJS } from 'immutable';

import { isType } from 'utils/validators';

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
    const newState = {
      closeOnBackdrop: isType(modal.closeOnBackdrop, 'Boolean')
        ? modal.closeOnBackdrop
        : false,
      content: React.isValidElement(modal.content) ? modal.content : null,
      onClose: isType(modal.onClose, 'Function') ? modal.onClose : null,
      visible: true,
    };
    return state.merge(newState);
  }
  return state;
}

export default reducer;
