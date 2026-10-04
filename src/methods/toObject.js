import assertNotInfinite from '../utils/assertNotInfinite';
import setInObject from '../utils/setInObject';

export function toObject() {
  assertNotInfinite(this.size);
  const object = {};
  this.__iterate((v, k) => {
    setInObject(object, k, v);
  });
  return object;
}
