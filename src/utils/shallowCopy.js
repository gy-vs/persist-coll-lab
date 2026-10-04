import arrCopy from './arrCopy';
import hasOwnProperty from './hasOwnProperty';
import setInObject from './setInObject';

export default function shallowCopy(from) {
  if (Array.isArray(from)) {
    return arrCopy(from);
  }
  const to = {};
  for (const key in from) {
    if (hasOwnProperty.call(from, key)) {
      setInObject(to, key, from[key]);
    }
  }
  return to;
}
