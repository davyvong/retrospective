import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import {
  INITIALIZE,
  EXECUTE_BATCH,
  BOARD_SNAPSHOT,
  GROUP_SNAPSHOT,
  ITEM_SNAPSHOT,
  UPDATE_BOARD,
  UPDATE_GROUP,
  UPDATE_ITEM,
} from './constants';

export const initialize = createAsyncAction(INITIALIZE);

export const executeBatch = createAsyncAction(EXECUTE_BATCH);

export const onBoardSnapshot = createAction(BOARD_SNAPSHOT);
export const onGroupSnapshot = createAction(GROUP_SNAPSHOT);
export const onItemSnapshot = createAction(ITEM_SNAPSHOT);

export const updateBoard = createAsyncAction(UPDATE_BOARD);
export const updateGroup = createAsyncAction(UPDATE_GROUP);
export const updateItem = createAsyncAction(UPDATE_ITEM);
