import { constructDoc } from 'utils/firebase';
import { isGUID, isType } from 'utils/validators';

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
  if (
    !destinationExists ||
    (destinationExists && !destination.data.prev && !append)
  ) {
    listUpdater(constructDoc(listId, { first: node.id }));
  }
}

function render(map, first, renderer) {
  const list = [];
  let current = first;
  while (isGUID(current, 'String') && isType(map[current], 'Object')) {
    list.push(current);
    current = map[current].next;
  }
  return list.map(renderer);
}

export default {
  deleteNode,
  insertNode,
  render,
};
