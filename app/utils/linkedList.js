import { constructDoc } from 'utils/firebase';
import { isGUID, isType } from 'utils/validators';

function reorderNode(state, destinationId, sourceId, append) {
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
    newState.first = sourceData.next;
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
    newState.first = sourceId;
  }
  return newState;
}

function deleteNode(nodeData, nodeUpdater, listId, listUpdater) {
  const updateQueue = [];
  if (isGUID(nodeData.prev)) {
    updateQueue.push(constructDoc(nodeData.prev, { next: nodeData.next }));
  } else {
    listUpdater(constructDoc(listId, { first: nodeData.next }));
  }
  if (isGUID(nodeData.next)) {
    updateQueue.push(constructDoc(nodeData.next, { prev: nodeData.prev }));
  }
  updateQueue.forEach(update => nodeUpdater(update));
}

function insertNode(
  destination,
  append,
  node,
  nodeUpdater,
  listId,
  listUpdater,
) {
  const updateQueue = [];
  let next = null;
  let prev = null;
  const destinationExists =
    isType(destination, 'Object') &&
    isGUID(destination.id) &&
    isType(destination.data, 'Object');
  if (destinationExists) {
    next = append ? destination.data.next : destination.id;
    prev = append ? destination.id : destination.data.prev;
  }
  updateQueue.push(
    constructDoc(node.id, {
      ...node.data,
      next,
      prev,
    }),
  );
  if (isGUID(next)) {
    updateQueue.push(constructDoc(next, { prev: node.id }));
  }
  if (isGUID(prev)) {
    updateQueue.push(constructDoc(prev, { next: node.id }));
  }
  updateQueue.forEach(update => nodeUpdater(update));
  if (!destinationExists || (!isGUID(prev) && !append)) {
    listUpdater(constructDoc(listId, { first: node.id }));
  }
}

function render(map, first, renderer) {
  const list = [];
  let current = first;
  while (isGUID(current) && isType(map[current], 'Object')) {
    list.push(current);
    current = map[current].next;
  }
  return list.map(renderer);
}

export default {
  deleteNode,
  insertNode,
  reorderNode,
  render,
};
