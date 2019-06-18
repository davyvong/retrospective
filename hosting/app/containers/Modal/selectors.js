import { createSelector } from 'reselect';

const selectState = state => state.get('modal');

const selectCloseOnBackdrop = () =>
  createSelector(selectState, state => state.get('closeOnBackdrop'));

const selectContent = () =>
  createSelector(selectState, state => {
    const content = state.get('content');
    return content ? content.toJS() : null;
  });

const selectOnClose = () =>
  createSelector(selectState, state => state.get('onClose'));

const selectVisible = () =>
  createSelector(selectState, state => state.get('visible'));

export { selectCloseOnBackdrop, selectContent, selectOnClose, selectVisible };
