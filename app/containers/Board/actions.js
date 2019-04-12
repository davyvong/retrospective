import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import {
  BOARD_SNAPSHOT,
  BOARD_GROUP_ADDED,
  BOARD_GROUP_MODIFIED,
  BOARD_GROUP_REMOVED,
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_REMOVED,
  INITIALIZE_BOARD,
  REMOVE_BOARD_GROUP,
  UPDATE_BOARD_GROUP,
  UPDATE_BOARD_INFO,
  REMOVE_BOARD_ITEM,
  UPDATE_BOARD_ITEM,
} from './constants';

export const boardSnapshot = createAction(BOARD_SNAPSHOT);

export const boardGroupAdded = createAction(BOARD_GROUP_ADDED);
export const boardGroupModified = createAction(BOARD_GROUP_MODIFIED);
export const boardGroupRemoved = createAction(BOARD_GROUP_REMOVED);

export const boardItemAdded = createAction(BOARD_ITEM_ADDED);
export const boardItemModified = createAction(BOARD_ITEM_MODIFIED);
export const boardItemRemoved = createAction(BOARD_ITEM_REMOVED);

export const initializeBoard = createAsyncAction(INITIALIZE_BOARD);

export const removeBoardGroup = createAsyncAction(REMOVE_BOARD_GROUP);
export const updateBoardGroup = createAsyncAction(UPDATE_BOARD_GROUP);

export const updateBoardInfo = createAsyncAction(UPDATE_BOARD_INFO);

export const removeBoardItem = createAsyncAction(REMOVE_BOARD_ITEM);
export const updateBoardItem = createAsyncAction(UPDATE_BOARD_ITEM);
