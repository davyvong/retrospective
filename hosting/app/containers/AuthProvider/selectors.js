import { createSelector } from 'reselect';

const selectState = state => state.get('auth');

const selectUID = () => createSelector(selectState, state => state.get('uid'));

export { selectUID };
