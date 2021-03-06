import { merge } from 'lodash';

import deepClone from 'utils/deepClone';
import { isDocument, isGUID, isType } from 'utils/validators';

import {
  constructDoc,
  getParentCollection,
  verifyCollectionType,
} from './helpers';

export function renderListV1(map, first, renderer) {
  const list = [];
  let count = 0;
  let current = first;
  while (isGUID(current) && isType(map[current], 'Object')) {
    list.push(current);
    current = map[current].next;
    count += 1;
    if (count > 1000) {
      return null;
    }
  }
  return list.map(renderer);
}

export function deleteNodeV2(node, collection) {
  if (!verifyCollectionType(collection)) {
    return [];
  }
  const queue = [];
  if (isGUID(node.data.prev)) {
    queue.push(
      constructDoc(node.data.prev, { next: node.data.next }, collection),
    );
  } else {
    queue.push(
      constructDoc(
        node.data.parent,
        { first: node.data.next },
        getParentCollection(collection),
      ),
    );
  }
  if (isGUID(node.data.next)) {
    queue.push(
      constructDoc(node.data.next, { prev: node.data.prev }, collection),
    );
  }
  queue.push(constructDoc(node.id, undefined, collection, 'delete'));
  return queue;
}

export function insertNodeV2(node, collection, destination, append = true) {
  if (!verifyCollectionType(collection)) {
    return [];
  }
  const queue = [];
  let next = null;
  let prev = null;
  if (isDocument(destination)) {
    next = append ? destination.data.next : destination.id;
    prev = append ? destination.id : destination.data.prev;
  }
  queue.push(constructDoc(node.id, { ...node.data, next, prev }, collection));
  if (isGUID(next)) {
    queue.push(constructDoc(next, { prev: node.id }, collection));
  }
  if (isGUID(prev)) {
    queue.push(constructDoc(prev, { next: node.id }, collection));
  }
  if (!isDocument(destination) || (!isGUID(prev) && !append)) {
    queue.push(
      constructDoc(
        node.data.parent,
        { first: node.id },
        getParentCollection(collection),
      ),
    );
  }
  return queue;
}

export function reorderNodeV1(prevState, nodeId, destinationId, append) {
  if (
    !isType(prevState, 'Object') ||
    !isType(prevState.items, 'Object') ||
    !isGUID(nodeId)
  ) {
    return {};
  }
  const state = deepClone(prevState);
  const node = deepClone(state.items[nodeId]);
  const updateState = (id, change = {}) => {
    const data = state.items[id] || {};
    state.items[id] = {
      ...data,
      ...change,
      dateModified: new Date().getTime(),
    };
  };
  if (!isType(node, 'Object')) {
    return {};
  }
  if (isGUID(node.prev)) {
    updateState(node.prev, { next: node.next });
  } else {
    state.first = node.next;
  }
  if (isGUID(node.next)) {
    updateState(node.next, { prev: node.prev });
  }
  const destinationExists =
    isGUID(destinationId) && isType(state.items[destinationId], 'Object');
  const destination = deepClone(state.items[destinationId] || {});
  let next = null;
  let prev = null;
  if (destinationExists) {
    next = append ? destination.next : destinationId;
    prev = append ? destinationId : destination.prev;
  }
  updateState(nodeId, { next, prev });
  if (isGUID(next)) {
    updateState(next, { prev: nodeId });
  }
  if (isGUID(prev)) {
    updateState(prev, { next: nodeId });
  }
  if (!destinationExists || (!isGUID(prev) && !append)) {
    state.first = nodeId;
  }
  return state;
}

export function reorderNodeV2(node, collection, destination, append = true) {
  if (!verifyCollectionType(collection) || !isDocument(node)) {
    return [];
  }
  const queue = [];
  const state = {};
  const updateState = (nodeId, nodeChanges = {}, nodeCollection) => {
    const prevState = state[nodeId] || {};
    state[nodeId] = merge(
      prevState,
      constructDoc(nodeId, nodeChanges, nodeCollection),
    );
    queue.push(state[nodeId]);
  };
  if (isGUID(node.data.prev)) {
    updateState(node.data.prev, { next: node.data.next }, collection);
  } else {
    updateState(
      node.data.parent,
      { first: node.data.next },
      getParentCollection(collection),
    );
  }
  if (isGUID(node.data.next)) {
    updateState(node.data.next, { prev: node.data.prev }, collection);
  }
  let next = null;
  let prev = null;
  updateState(node.id, { next, prev }, collection);
  if (isDocument(destination)) {
    next = append
      ? (state[destination.id] && state[destination.id].data.next) ||
        destination.data.next
      : destination.id;
    prev = append
      ? destination.id
      : (state[destination.id] && state[destination.id].data.prev) ||
        destination.data.prev;
  }
  if (isGUID(next)) {
    updateState(next, { prev: node.id }, collection);
  }
  if (isGUID(prev)) {
    updateState(prev, { next: node.id }, collection);
  }
  updateState(node.id, { next, prev }, collection);
  if (!isDocument(destination) || (!isGUID(prev) && !append)) {
    updateState(
      node.data.parent,
      { first: node.id },
      getParentCollection(collection),
    );
  }
  return queue;
}
