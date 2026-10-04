import assertNotInfinite from '../utils/assertNotInfinite';
import setProp from '../utils/setProp';

export function toObject() {
  assertNotInfinite(this.size);
  const object = {};
  this.__iterate((v, k) => {
    setProp(object, k, v);
  });
  return object;
}
