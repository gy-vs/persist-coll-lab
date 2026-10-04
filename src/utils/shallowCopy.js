import arrCopy from './arrCopy';
import hasOwnProperty from './hasOwnProperty';
import setProp from './setProp';

export default function shallowCopy(from) {
  if (Array.isArray(from)) {
    return arrCopy(from);
  }
  const to = {};
  for (const key in from) {
    if (hasOwnProperty.call(from, key)) {
      setProp(to, key, from[key]);
    }
  }
  return to;
}
