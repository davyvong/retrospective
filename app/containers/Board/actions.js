import createAction from 'utils/createAction';

import {
  BOARD_SNAPSHOT,
  BOARD_ITEM_ADDED,
  BOARD_ITEM_MODIFIED,
  BOARD_ITEM_DELETED,
} from './constants';

export const boardSnapshot = createAction(BOARD_SNAPSHOT);

export const boardItemAdded = createAction(BOARD_ITEM_ADDED);
export const boardItemModified = createAction(BOARD_ITEM_MODIFIED);
export const boardItemDeleted = createAction(BOARD_ITEM_DELETED);
