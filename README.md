# redux-struct

`redux-struct` is a set of tools providing a solid structure to keep and update entities in Redux store.

## Installation
```
$ npm i redux-struct
```

## Usage
1. Add `redux-struct` reducer to your root reducer:
```js
import { combineReducers } from 'redux';
import { reducer as struct } from 'redux-struct';

const rootReducer = combineReducers({
  struct,
  // other reducers
});
```

2. Make an async wrapper for `redux-struct` actions. Implementation depends from tool you choose to maintain side effects in Redux. Here is example for `redux-saga`:
```js
import { put, call } from 'redux-saga/effects';
import { startStructFetch, stopStructFetch } from 'redux-struct';

import api from 'utils/api';

export function* fetchStruct(structId, url) {
  try {
    yield put(startStructFetch(structId));
    const result = yield call(api.get, url);
    yield put(stopStructFetch(structId, result));
    return { result };
  } catch (error) {
    yield put(stopStructFetch(structId, error));
    return { error };
  }
};
```

3. Call this async wrapper in other sagas or async action creators:
```js
import { call } from 'redux-saga/effects';

import { fetchStruct } from 'utils/sagas';

function* fetchUser(id) {
  const { result, error } = yield call(fetchStruct, `user/${id}`, `api/user/${id}`);
};
```

4. Get current state of struct from Redux store for usage in React component:
```js
import { getStruct } from 'redux-scruct';

const mapStateToProps = (state, props) => {
  const { userId } = props;
  return {
    user: getStruct(userId)(state),
  };
}
```

## Struct

Struct is a piece of data that can represent any entity or collection of entities: user, array of orders, etc. Struct are initiated automatically when first action with given structId is dispatched. All structs has same initial structure:
```js
{
  isFetching: false,
  data: null,
  error: null,
}
```

## API

### `reducer()`
The struct reducer. Should be mounted to your Redux state at `struct`

### `getStruct(structId:String, [getStructState:Function])`, returns `state => struct:Object`
Selector, gets struct by name. Will return default struct if nothing was found. Has optional second argument `getStructState()` that is used to select the mount point of the `redux-struct` reducer from the root Redux reducer. It defaults to `state => state.struct`.

### `startStructFetch(structId:String)`
Action creator, sets structs `isFetching` to `true` and `error` to `null`. Ignores other fields.

### `stopStructFetch(structId:String, payload:any)`
Action creator, sets structs `isFetching` to `false`. If payload is instance of `Error`, sets `error` to payload and keep the `data`. Otherwise sets `data` to payload and `error` to `null`.

### `updateStruct(structId:String, payload:any)`
Action creator, merges struct with payload.

### `resetStruct(structId:String)`
Action creator, resets struct to its default state.
