import assert from 'node:assert/strict';
export { describe, it } from 'node:test';
export const expect = actual => ({
    toBe: expected => assert.equal(actual, expected),
    toEqual: expected => assert.deepEqual(actual, expected),
    toBeLessThan: expected => assert.ok(actual < expected, `${actual} < ${expected}`),
    toBeGreaterThan: expected => assert.ok(actual > expected, `${actual} > ${expected}`),
    toBeLessThanOrEqual: expected => assert.ok(actual <= expected, `${actual} <= ${expected}`),
});
