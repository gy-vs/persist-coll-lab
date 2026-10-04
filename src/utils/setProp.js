// Assigns a property on a plain JavaScript object as a normal own data
// property, even when the key is "__proto__". A plain assignment like
// `object[key] = value` invokes the inherited __proto__ setter for that key,
// which replaces the object's prototype instead of adding an own property,
// so such keys need Object.defineProperty.
export default function setProp(object, key, value) {
  if (typeof key === 'string' && key === '__proto__') {
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
