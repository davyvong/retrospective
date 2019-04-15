import { createSelector } from 'reselect';

const selectState = state => state.get('board');

const selectInfo = () =>
  createSelector(selectState, state => state.get('info').toJS());

const selectGroups = () =>
  createSelector(selectState, state => state.get('groups').toJS());

const selectBoardId = () =>
  createSelector(selectState, state => state.get('id'));

const selectComments = () =>
  createSelector(selectState, state => state.get('comments').toJS());

const selectItems = () =>
  createSelector(selectState, state => state.get('items').toJS());

const selectVotes = () =>
  createSelector(selectState, state => state.get('votes').toJS());

export {
  selectBoardId,
  selectComments,
  selectGroups,
  selectInfo,
  selectItems,
  selectVotes,
};
