import asyncActionCreators from '../createAsyncAction';

describe('asyncActionCreators', () => {
  const ASYNC_ACTION = {
    REQUEST: 'ASYNC_ACTION_REQUEST',
    SUCCESS: 'ASYNC_ACTION_SUCCESS',
    FAILURE: 'ASYNC_ACTION_FAILURE',
  };
  const params = {
    username: 'test',
  };
  const payload = {
    username: 'test',
    firstname: 'Roberto',
    lastname: 'Testo',
  };
  const error = new Error('oops!');

  it('should return a request action creator', () => {
    const actionCreators = asyncActionCreators(ASYNC_ACTION);
    expect(actionCreators.request(params)).toEqual({
      type: ASYNC_ACTION.REQUEST,
      params,
    });
  });

  it('Should return a success action creator', () => {
    const actionCreators = asyncActionCreators(ASYNC_ACTION);
    expect(actionCreators.success(payload)).toEqual({
      type: ASYNC_ACTION.SUCCESS,
      payload,
    });
  });

  it('Should return a failure action creator', () => {
    const actionCreators = asyncActionCreators(ASYNC_ACTION);
    expect(actionCreators.failure(error)).toEqual({
      type: ASYNC_ACTION.FAILURE,
      error,
    });
  });
});
