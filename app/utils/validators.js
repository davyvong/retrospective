export function isAuthUID(str = '') {
  if (!isType(str, 'String')) {
    return false;
  }
  if (str.length !== 28) {
    return false;
  }
  return true;
}

export function isDocument(doc) {
  if (!isType(doc, 'Object')) {
    return false;
  }
  if (!isType(doc.data, 'Object')) {
    return false;
  }
  if (!isGUID(doc.id)) {
    return false;
  }
  return true;
}

export function isGUID(str = '') {
  if (!isType(str, 'String')) {
    return false;
  }
  const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!re.test(str)) {
    return false;
  }
  return true;
}

export function isType(element, type) {
  return Object.prototype.toString.call(element) === `[object ${type}]`;
}
