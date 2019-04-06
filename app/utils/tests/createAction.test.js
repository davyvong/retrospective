import createAction from '../createAction';

describe('createAction', () => {
  const ACTION = 'ACTION';
  const params = {
    username: 'test',
  };

  it('should return an action creator', () => {
    const actionCreators = createAction(ACTION);
    expect(actionCreators(params)).toEqual({
      type: ACTION,
      params,
    });
  });
});
