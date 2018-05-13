import { getIsValidStructId } from './utils';

const validateStructId = (structId) => {
  if (process.env.NODE_ENV !== 'production' && !getIsValidStructId(structId)) {
    // eslint-disable-next-line no-console
    console.warn(`Expected nonempty string or integer as struct id, got ${structId}`);
  }
};

const defaultStructState = {
  isFetching: false,
  error: null,
  data: null,
};

const start = (state, { structId }) => {
  validateStructId(structId);
  return {
    ...state,
    isFetching: true,
    error: null,
  };
};

const stop = (state, { structId, payload }) => {
  validateStructId(structId);
  const hasError = payload instanceof Error;
  return {
    ...state,
    isFetching: false,
    error: hasError ? payload : defaultStructState.error,
    data: hasError ? state.data : payload || defaultStructState.data,
  };
};

const update = (state, { structId, payload }) => {
  validateStructId(structId);
  return {
    ...state,
    ...payload,
  };
};

function struct(state = defaultStructState, action) {
  switch (action.type) {
    case 'struct/START_FETCH':
      return start(state, action);
    case 'struct/STOP_FETCH':
      return stop(state, action);
    case 'struct/UPDATE':
      return update(state, action);
    case 'struct/RESET':
      return defaultStructState;
    default:
      return state;
  }
}

export function reducer(state = {}, action) {
  switch (action.type) {
    case 'struct/START_FETCH':
    case 'struct/STOP_FETCH':
    case 'struct/UPDATE':
    case 'struct/RESET': {
      const { structId } = action;
      return {
        ...state,
        [structId]: struct(state[structId], action),
      };
    }
    default:
      return state;
  }
}

const getStructState = state => state.struct;

export const getStruct = (structId, getState = getStructState) => (state) => {
  validateStructId(structId);
  return getState(state)[structId] || defaultStructState;
};

export const startStructFetch = structId => ({ type: 'struct/START_FETCH', structId });
export const stopStructFetch = (structId, payload) => ({ type: 'struct/STOP_FETCH', structId, payload });
export const updateStruct = (structId, payload) => ({ type: 'struct/UPDATE', structId, payload });
export const resetStruct = structId => ({ type: 'struct/RESET', structId });
