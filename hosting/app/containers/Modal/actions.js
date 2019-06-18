import createAction from 'utils/createAction';

import { CLOSE_MODAL, OPEN_MODAL } from './constants';

export const closeModal = createAction(CLOSE_MODAL);
export const openModal = createAction(OPEN_MODAL);
