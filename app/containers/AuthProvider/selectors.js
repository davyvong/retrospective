import { createSelector } from 'reselect';

const selectState = state => state.get('auth');

const selectAuthUID = () =>
  createSelector(selectState, state => state.get('uid'));

export { selectAuthUID };
