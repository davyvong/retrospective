import createRequestTypes from '../createRequestTypes';

describe('createRequestTypes', () => {
  const ASYNC_ACTION_REQUEST = 'ASYNC_ACTION_REQUEST';
  const ASYNC_ACTION_SUCCESS = 'ASYNC_ACTION_SUCCESS';
  const ASYNC_ACTION_FAILURE = 'ASYNC_ACTION_FAILURE';

  it('should return an object with keys REQUEST, SUCCESS, FAILURE', () => {
    const ASYNC_ACTION = createRequestTypes('ASYNC_ACTION');
    expect(ASYNC_ACTION).toEqual({
      REQUEST: ASYNC_ACTION_REQUEST,
      SUCCESS: ASYNC_ACTION_SUCCESS,
      FAILURE: ASYNC_ACTION_FAILURE,
    });
  });
});
