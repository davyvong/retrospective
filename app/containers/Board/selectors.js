import { createSelector } from 'reselect';

const selectState = state => state.get('board');

const selectBoardGroups = () =>
  createSelector(selectState, state => state.get('groups').toJS());

const selectBoardId = () =>
  createSelector(selectState, state => state.get('id'));

const selectBoardInfo = () =>
  createSelector(selectState, state => state.get('info').toJS());

const selectBoardItems = () =>
  createSelector(selectState, state => state.get('items').toJS());

export { selectBoardGroups, selectBoardId, selectBoardInfo, selectBoardItems };
