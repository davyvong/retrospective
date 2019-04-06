import { createSelector } from 'reselect';

const selectState = state => state.get('board');

const selectBoardItems = () =>
  createSelector(selectState, state => state.get('items').toJS());

export { selectBoardItems };
