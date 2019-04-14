import createRequestTypes from 'utils/createRequestTypes';

const scope = 'APP/BOARD';

export const INITIALIZE = createRequestTypes(`${scope}/INITIALIZE`);

export const EXECUTE_BATCH = createRequestTypes(`${scope}/EXECUTE_BATCH`);

export const BOARD_SNAPSHOT = `${scope}/BOARD_SNAPSHOT`;
export const GROUP_SNAPSHOT = `${scope}/GROUP_SNAPSHOT`;
export const ITEM_SNAPSHOT = `${scope}/ITEM_SNAPSHOT`;

export const UPDATE_BOARD = createRequestTypes(`${scope}/UPDATE_BOARD`);
export const UPDATE_GROUP = createRequestTypes(`${scope}/UPDATE_GROUP`);
export const UPDATE_ITEM = createRequestTypes(`${scope}/UPDATE_ITEM`);
