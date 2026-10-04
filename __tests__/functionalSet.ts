import { remove, set, update } from 'immutable';

const PROTO = '__proto__';

describe('functional set', () => {
  it('sets a __proto__ key as data without altering the prototype', () => {
    const result = set({}, PROTO, { isAdmin: true }) as Record<string, unknown>;

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result)).toEqual([PROTO]);
    expect(Object.getOwnPropertyDescriptor(result, PROTO)).toMatchObject({
      enumerable: true,
      value: { isAdmin: true },
    });
    expect((result as { isAdmin?: boolean }).isAdmin).toBe(undefined);
  });

  it('preserves an existing own __proto__ data key when copying', () => {
    const parsed = JSON.parse('{"title":"t","__proto__":{"isAdmin":true}}');
    const result = set(parsed, 'title', 'x') as {
      title: string;
      isAdmin?: boolean;
    };

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result).sort()).toEqual([PROTO, 'title']);
    expect(result.isAdmin).toBe(undefined);
    expect(Object.getOwnPropertyDescriptor(result, PROTO)).toMatchObject({
      value: { isAdmin: true },
    });
  });

  it('returns the same object for a no-op, even for __proto__', () => {
    const parsed = JSON.parse('{"title":"t","__proto__":{"isAdmin":true}}');
    const protoValue = Object.getOwnPropertyDescriptor(parsed, PROTO)!.value;

    expect(set(parsed, 'title', 't')).toBe(parsed);
    expect(set(parsed, PROTO, protoValue)).toBe(parsed);
  });
});

describe('functional update', () => {
  it('updates a normal key while keeping __proto__ as data', () => {
    const parsed = JSON.parse('{"title":"t","__proto__":{"isAdmin":true}}');
    const result = update(
      parsed as { title: string },
      'title',
      (value: string) => value + '!'
    ) as {
      title: string;
      isAdmin?: boolean;
    };

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result.title).toBe('t!');
    expect(result.isAdmin).toBe(undefined);
    expect(Object.keys(result).sort()).toEqual([PROTO, 'title']);
  });

  it('updates a __proto__ key without altering the prototype', () => {
    // @ts-expect-error -- '__proto__' is a valid runtime data key, but it is
    // not a declared property of the empty object
    const result = update({}, PROTO, null, (value: unknown) =>
      value === null ? { isAdmin: true } : value
    ) as { isAdmin?: boolean };

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result.isAdmin).toBe(undefined);
    expect(Object.getOwnPropertyDescriptor(result, PROTO)).toMatchObject({
      value: { isAdmin: true },
    });
  });
});

describe('functional remove', () => {
  it('keeps __proto__ as data when copying another key out', () => {
    const parsed = JSON.parse('{"title":"t","__proto__":{"isAdmin":true}}');
    const result = remove(parsed, 'title') as {
      title?: string;
      isAdmin?: boolean;
    };

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result.title).toBe(undefined);
    expect(result.isAdmin).toBe(undefined);
    expect(Object.keys(result)).toEqual([PROTO]);
  });

  it('removes an own __proto__ data key without altering the prototype', () => {
    const parsed = JSON.parse('{"title":"t","__proto__":{"isAdmin":true}}');
    const result = remove(parsed, PROTO);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result)).toEqual(['title']);
    expect(Object.getOwnPropertyDescriptor(result, PROTO)).toBe(undefined);
  });

  it('sets __proto__ on an array as data', () => {
    // @ts-expect-error -- '__proto__' is a valid runtime data key on an array
    const result = set([1, 2], PROTO, { isAdmin: true }) as {
      isAdmin?: boolean;
    };

    expect(Array.isArray(result)).toBe(true);
    expect(result.isAdmin).toBe(undefined);
    expect(Object.getOwnPropertyDescriptor(result, PROTO)).toMatchObject({
      value: { isAdmin: true },
    });
  });
});
