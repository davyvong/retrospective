function createAction(type) {
  return params => ({
    type,
    params,
  });
}

export default createAction;
