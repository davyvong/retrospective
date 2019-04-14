import { createSelector } from 'reselect';

const selectState = state => state.get('board');

const selectGroups = () =>
  createSelector(selectState, state => state.get('groups').toJS());

const selectBoardId = () =>
  createSelector(selectState, state => state.get('id'));

const selectInfo = () =>
  createSelector(selectState, state => state.get('info').toJS());

const selectItems = () =>
  createSelector(selectState, state => state.get('items').toJS());

export { selectGroups, selectBoardId, selectInfo, selectItems };
