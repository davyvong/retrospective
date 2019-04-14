import { isDocument, isGUID, isType } from 'utils/validators';

import {
  constructDoc,
  getParentCollection,
  verifyCollectionType,
} from './helpers';

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
        { child: node.data.next },
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
        { child: node.id },
        getParentCollection(collection),
      ),
    );
  }
  return queue;
}

export function renderListV2(map, child, renderer) {
  const list = [];
  let current = child;
  while (isGUID(current) && isType(map[current], 'Object')) {
    list.push(current);
    current = map[current].next;
  }
  return list.map(renderer);
}

export function reorderNodeV2(node, collection, destination, append = true) {
  if (!verifyCollectionType(collection)) {
    return [];
  }
  const dQueue = deleteNodeV2(node, collection, false);
  const iQueue = insertNodeV2(node, collection, destination, append);
  return [...dQueue, ...iQueue];
}

export function reorderNodeV1(state, destinationId, sourceId, append) {
  if (!isType(state, 'Object')) {
    return {};
  }
  const newState = Object.assign({}, state);
  if (!isGUID(sourceId)) {
    return {};
  }
  const sourceData = newState.items[sourceId];
  if (!isType(sourceData, 'Object')) {
    return {};
  }
  if (
    isGUID(sourceData.prev) &&
    isType(newState.items[sourceData.prev], 'Object')
  ) {
    Object.assign(newState.items[sourceData.prev], {
      next: sourceData.next,
    });
  } else {
    newState.child = sourceData.next;
  }
  if (
    isGUID(sourceData.next) &&
    isType(newState.items[sourceData.next], 'Object')
  ) {
    Object.assign(newState.items[sourceData.next], {
      prev: sourceData.prev,
    });
  }
  const destinationExists =
    isGUID(destinationId) && isType(newState.items[destinationId], 'Object');
  const destinationData = newState.items[destinationId] || {};
  sourceData.next = null;
  sourceData.prev = null;
  if (destinationExists) {
    sourceData.next = append ? destinationData.next : destinationId;
    sourceData.prev = append ? destinationId : destinationData.prev;
  }
  Object.assign(newState.items[sourceId], {
    next: sourceData.next,
    prev: sourceData.prev,
  });
  if (
    isGUID(sourceData.next) &&
    isType(newState.items[sourceData.next], 'Object')
  ) {
    Object.assign(newState.items[sourceData.next], {
      prev: sourceId,
    });
  }
  if (
    isGUID(sourceData.prev) &&
    isType(newState.items[sourceData.prev], 'Object')
  ) {
    Object.assign(newState.items[sourceData.prev], {
      next: sourceId,
    });
  }
  if (
    !destinationExists ||
    (!isGUID(newState.items[sourceId].prev) && !append)
  ) {
    newState.child = sourceId;
  }
  return newState;
}
