import createAction from 'utils/createAction';
import createAsyncAction from 'utils/createAsyncAction';

import { AUTHORIZE_ANONYMOUSLY, SET_AUTH_UID } from './constants';

export const authorizeAnonymously = createAsyncAction(AUTHORIZE_ANONYMOUSLY);

export const setAuthUID = createAction(SET_AUTH_UID);
