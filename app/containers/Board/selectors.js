import { createSelector } from 'reselect';

const selectState = state => state.get('board');

const selectBoardInfo = () =>
  createSelector(selectState, state => ({
    context: state.get('context'),
    title: state.get('title'),
  }));

const selectBoardGroups = () =>
  createSelector(selectState, state => state.get('groups').toJS());

const selectBoardItems = () =>
  createSelector(selectState, state => state.get('items').toJS());

export { selectBoardInfo, selectBoardGroups, selectBoardItems };
