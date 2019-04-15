export const COLLECTION_TYPES = {
  BOARDS: 'boards',
  COMMENTS: 'comments',
  GROUPS: 'groups',
  ITEMS: 'items',
  VOTES: 'votes',
};

export const COLLECTION_MAP = {
  [COLLECTION_TYPES.COMMENTS]: {
    parent: COLLECTION_TYPES.ITEMS,
  },
  [COLLECTION_TYPES.GROUPS]: {
    parent: COLLECTION_TYPES.BOARDS,
  },
  [COLLECTION_TYPES.ITEMS]: {
    parent: COLLECTION_TYPES.GROUPS,
  },
  [COLLECTION_TYPES.VOTES]: {
    parent: COLLECTION_TYPES.ITEMS,
  },
};
