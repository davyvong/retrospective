import createRequestTypes from 'utils/createRequestTypes';

const scope = 'APP/BOARD';

export const BOARD_SNAPSHOT = `${scope}/BOARD_SNAPSHOT`;

export const BOARD_GROUP_ADDED = `${scope}/BOARD_GROUP_ADDED`;
export const BOARD_GROUP_MODIFIED = `${scope}/BOARD_GROUP_MODIFIED`;
export const BOARD_GROUP_REMOVED = `${scope}/BOARD_GROUP_REMOVED`;

export const BOARD_ITEM_ADDED = `${scope}/BOARD_ITEM_ADDED`;
export const BOARD_ITEM_MODIFIED = `${scope}/BOARD_ITEM_MODIFIED`;
export const BOARD_ITEM_REMOVED = `${scope}/BOARD_ITEM_REMOVED`;

export const INITIALIZE_BOARD = createRequestTypes(`${scope}/INITIALIZE_BOARD`);

export const UPDATE_BOARD_GROUP = createRequestTypes(
  `${scope}/UPDATE_BOARD_GROUP`,
);
export const UPDATE_BOARD_INFO = createRequestTypes(
  `${scope}/UPDATE_BOARD_INFO`,
);
export const UPDATE_BOARD_ITEM = createRequestTypes(
  `${scope}/UPDATE_BOARD_ITEM`,
);

export const EXECUTE_BATCH = createRequestTypes(`${scope}/EXECUTE_BATCH`);
