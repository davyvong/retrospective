import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import {
  BOARD_SNAPSHOT,
  BOARD_GROUP_ADDED,
  BOARD_GROUP_MODIFIED,
  BOARD_GROUP_DELETED,
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_DELETED,
  INITIALIZE_BOARD,
  UPDATE_BOARD_INFO,
} from './constants';

export const boardSnapshot = createAction(BOARD_SNAPSHOT);

export const boardGroupAdded = createAction(BOARD_GROUP_ADDED);
export const boardGroupModified = createAction(BOARD_GROUP_MODIFIED);
export const boardGroupDeleted = createAction(BOARD_GROUP_DELETED);

export const boardItemAdded = createAction(BOARD_ITEM_ADDED);
export const boardItemModified = createAction(BOARD_ITEM_MODIFIED);
export const boardItemDeleted = createAction(BOARD_ITEM_DELETED);

export const initializeBoard = createAsyncAction(INITIALIZE_BOARD);

export const updateBoardInfo = createAsyncAction(UPDATE_BOARD_INFO);
