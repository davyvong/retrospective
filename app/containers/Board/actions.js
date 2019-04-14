import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import {
  INITIALIZE,
  EXECUTE_BATCH,
  BOARD_SNAPSHOT,
  GROUP_SNAPSHOT,
  ITEM_SNAPSHOT,
  UPDATE_GROUP,
  UPDATE_INFO,
  UPDATE_ITEM,
} from './constants';

export const initialize = createAsyncAction(INITIALIZE);

export const executeBatch = createAsyncAction(EXECUTE_BATCH);

export const onBoardSnapshot = createAction(BOARD_SNAPSHOT);
export const onGroupSnapshot = createAction(GROUP_SNAPSHOT);
export const onItemSnapshot = createAction(ITEM_SNAPSHOT);

export const updateBoardGroup = createAsyncAction(UPDATE_GROUP);
export const updateBoardInfo = createAsyncAction(UPDATE_INFO);
export const updateBoardItem = createAsyncAction(UPDATE_ITEM);
