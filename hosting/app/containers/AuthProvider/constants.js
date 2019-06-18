import createRequestTypes from 'utils/createRequestTypes';

const scope = 'APP/AUTH_PROVIDER';

export const AUTHORIZE_ANONYMOUSLY = createRequestTypes(
  `${scope}/AUTHORIZE_ANONYMOUSLY`,
);

export const SET_AUTH_UID = `${scope}/SET_AUTH_UID`;
