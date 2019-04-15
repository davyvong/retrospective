import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import {
  INITIALIZE,
  EXECUTE_BATCH,
  BOARD_SNAPSHOT,
  COMMENT_SNAPSHOT,
  GROUP_SNAPSHOT,
  ITEM_SNAPSHOT,
  VOTE_SNAPSHOT,
  UPDATE_BOARD,
  UPDATE_COMMENT,
  UPDATE_GROUP,
  UPDATE_ITEM,
  UPDATE_VOTE,
} from './constants';

export const initialize = createAsyncAction(INITIALIZE);

export const executeBatch = createAsyncAction(EXECUTE_BATCH);

export const onBoardSnapshot = createAction(BOARD_SNAPSHOT);
export const onGroupSnapshot = createAction(GROUP_SNAPSHOT);
export const onCommentSnapshot = createAction(COMMENT_SNAPSHOT);
export const onItemSnapshot = createAction(ITEM_SNAPSHOT);
export const onVoteSnapshot = createAction(VOTE_SNAPSHOT);

export const updateBoard = createAsyncAction(UPDATE_BOARD);
export const updateGroup = createAsyncAction(UPDATE_GROUP);
export const updateComment = createAsyncAction(UPDATE_COMMENT);
export const updateItem = createAsyncAction(UPDATE_ITEM);
export const updateVote = createAsyncAction(UPDATE_VOTE);
