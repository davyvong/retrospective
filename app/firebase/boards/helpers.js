import { isType } from 'utils/validators';

import { COLLECTION_MAP, COLLECTION_TYPES } from './constants';

export function constructDoc(id, data = {}, collection, change = 'set') {
  return {
    change,
    collection: verifyCollectionType(collection) ? collection : null,
    data: {
      ...data,
      dateModified: new Date().getTime(),
    },
    id,
  };
}

export function getParentCollection(collection) {
  if (isType(COLLECTION_MAP[collection], 'Object')) {
    return COLLECTION_MAP[collection].parent;
  }
  return null;
}

export function verifyCollectionType(collection) {
  if (!isType(collection, 'String')) {
    return false;
  }
  return Object.values(COLLECTION_TYPES).includes(collection);
}
