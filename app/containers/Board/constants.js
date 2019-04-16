import createRequestTypes from 'utils/createRequestTypes';

const scope = 'APP/BOARD';

export const INITIALIZE = createRequestTypes(`${scope}/INITIALIZE`);

export const CREATE_BOARD = createRequestTypes(`${scope}/CREATE_BOARD`);

export const EXECUTE_BATCH = createRequestTypes(`${scope}/EXECUTE_BATCH`);

export const BOARD_SNAPSHOT = `${scope}/BOARD_SNAPSHOT`;
export const COMMENT_SNAPSHOT = `${scope}/COMMENT_SNAPSHOT`;
export const GROUP_SNAPSHOT = `${scope}/GROUP_SNAPSHOT`;
export const ITEM_SNAPSHOT = `${scope}/ITEM_SNAPSHOT`;
export const VOTE_SNAPSHOT = `${scope}/VOTE_SNAPSHOT`;

export const UPDATE_BOARD = createRequestTypes(`${scope}/UPDATE_BOARD`);
export const UPDATE_COMMENT = createRequestTypes(`${scope}/UPDATE_COMMENT`);
export const UPDATE_GROUP = createRequestTypes(`${scope}/UPDATE_GROUP`);
export const UPDATE_ITEM = createRequestTypes(`${scope}/UPDATE_ITEM`);
export const UPDATE_VOTE = createRequestTypes(`${scope}/UPDATE_VOTE`);
