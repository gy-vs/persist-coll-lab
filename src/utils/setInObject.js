/**
 * Assigns a value to a property on an object while treating `__proto__` as a
 * regular data key instead of triggering the prototype setter (which would
 * change the object's prototype and lead to prototype pollution).
 *
 * Aligns the behavior of plain-object writes with `JSON.parse`, which stores
 * `__proto__` as an own enumerable property without altering the prototype.
 */
export default function setInObject(object, key, value) {
  if (key === '__proto__') {
    Object.defineProperty(object, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    object[key] = value;
  }
}
