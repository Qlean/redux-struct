import { reducer, getStruct, startStructFetch, stopStructFetch, updateStruct, resetStruct } from '..';

const initialStructState = {
  isFetching: false,
  error: null,
  data: null,
};

const testStructId = 'someStruct';
const testData = { foo: 'bar' };
const testError = new Error('testError');
const testStateFetching = {
  [testStructId]: {
    ...initialStructState,
    isFetching: true,
  },
};
const testStateWithData = {
  [testStructId]: {
    ...initialStructState,
    data: testData,
  },
};
const testStateWithError = {
  [testStructId]: {
    ...initialStructState,
    error: testError,
  },
};
const testPayloadFull = {
  isFetching: false,
  data: testData,
  error: testError,
  foo: 'bar',
};
const testStateFull = {
  [testStructId]: {
    ...testPayloadFull,
  },
};

describe('Exports works correctly', () => {
  test('Reducer is exported', () => {
    expect(typeof reducer).toBe('function');
  });
  test('Selector is exported', () => {
    expect(typeof getStruct).toBe('function');
  });
  test('Actions are exported', () => {
    expect(typeof startStructFetch).toBe('function');
    expect(typeof stopStructFetch).toBe('function');
    expect(typeof updateStruct).toBe('function');
    expect(typeof resetStruct).toBe('function');
  });
});

describe('Reducer works correctly', () => {
  test('Initial state is {}', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({});
  });
  test('Supports multiple structs', () => {
    expect(reducer(testStateWithData, updateStruct('foo', {}))).toEqual({
      ...testStateWithData,
      foo: initialStructState,
    });
  });
});

describe('Selector works correctly', () => {
  const testState = {
    struct: testStateFull,
    foo: testStateFull,
  };
  test('Selector returns struct by id', () => {
    expect(getStruct(testStructId)(testState)).toEqual(testPayloadFull);
  });
  test('Selector returns default state if struct is not found', () => {
    expect(getStruct('bar')(testState)).toEqual(initialStructState);
  });
  test('Selector accepts getStructState as optional parameter', () => {
    expect(getStruct(testStructId, state => state.foo)(testState)).toEqual(testPayloadFull);
  });
});

describe('startStructFetch works correctly', () => {
  const action = startStructFetch(testStructId);
  test('startStructFetch has proper shape', () => {
    expect(action).toEqual({
      type: 'struct/START_FETCH',
      structId: testStructId,
    });
  });
  test('startStructFetch sets isFetching to true', () => {
    expect(reducer({}, action)[testStructId].isFetching).toBe(true);
  });
  test('startStructFetch not touches data', () => {
    expect(reducer(testStateWithData, action)[testStructId].data).toEqual(testData);
  });
  test('startStructFetch nullifies error', () => {
    expect(reducer(testStateWithError, action)[testStructId].error).toBe(null);
  });
});

describe('stopStructFetch works correctly', () => {
  const action = stopStructFetch(testStructId, testData);
  const actionErr = stopStructFetch(testStructId, testError);
  test('stopStructFetch has proper shape', () => {
    expect(action).toEqual({
      type: 'struct/STOP_FETCH',
      structId: testStructId,
      payload: testData,
    });
    expect(actionErr).toEqual({
      type: 'struct/STOP_FETCH',
      structId: testStructId,
      payload: testError,
    });
  });
  test('stopStructFetch sets isFetching to false', () => {
    expect(reducer(testStateFetching, action)[testStructId].isFetching).toBe(false);
  });
  test('stopStructFetch sets data to payload', () => {
    expect(reducer({}, action)[testStructId].data).toEqual(testData);
  });
  test('stopStructFetch not touches data if payload is error', () => {
    expect(reducer(testStateWithData, actionErr)[testStructId].data).toEqual(testData);
  });
  test('stopStructFetch nullifies error', () => {
    expect(reducer(testStateWithError, action)[testStructId].error).toBe(null);
  });
  test('stopStructFetch sets error if payload is error', () => {
    expect(reducer(testStateWithData, actionErr)[testStructId].error).toEqual(testError);
  });
});

describe('updateStruct works correctly', () => {
  const action = updateStruct(testStructId, testPayloadFull);
  test('updateStruct has proper shape', () => {
    expect(action).toEqual({
      type: 'struct/UPDATE',
      structId: testStructId,
      payload: testPayloadFull,
    });
  });
  test('updateStruct updates struct', () => {
    expect(reducer({}, action)[testStructId]).toEqual(testPayloadFull);
  });
  test('updateStruct merges properies', () => {
    const state = { [testStructId]: { bar: 'baz' } };
    expect(reducer(state, action)[testStructId].bar).toEqual('baz');
  });
  test('updateStruct adds missing properies', () => {
    expect(reducer({}, updateStruct('foo', {})).foo).toEqual(initialStructState);
  });
});

describe('resetStruct works correctly', () => {
  const action = resetStruct(testStructId);
  test('resetStruct has proper shape', () => {
    expect(action).toEqual({
      type: 'struct/RESET',
      structId: testStructId,
    });
  });
  test('resetStruct resets struct to initial shape', () => {
    expect(reducer(testStateFull, action)[testStructId]).toEqual(initialStructState);
  });
});
