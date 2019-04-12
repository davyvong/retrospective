function constructDoc(id, data = {}) {
  return {
    data: {
      ...data,
      dateModified: new Date().getTime(),
    },
    id,
  };
}

export default constructDoc;
