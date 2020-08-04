import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_ACCESSES, LOAD_ACCESS, ADD_ACCESS, DELETE_ACCESS, UPDATE_ACCESS } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/access'

// ==================================
// Selectors
// ==================================
export const accessListSelector = createSelector(
    state => state.accesses,
    accesses => accesses.list
);

export const accessSelector = id => createSelector(
    state => state.accesses,
    accesses => accesses.list.find(access => access.id === id)
);

// ==================================
// Actions
// ==================================
export const loadAccesses = createAction(LOAD_ACCESSES, () => {
    return API.get(apiName, path);
});

export const loadAccess = createAction(LOAD_ACCESS, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createAccess = createAction(ADD_ACCESS, accessData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...accessData
        }
    });
});

export const deleteAccess = createAction(DELETE_ACCESS, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateAccess = createAction(UPDATE_ACCESS, accessData => {
    return API.put(apiName, path, {
        body: accessData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadAccesses)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadAccess)]: (state, action) => ({
        ...state,
        list: action.payload
    })
};

// ==================================
// Reducer
// ==================================
const initialState = {
    list: []
};

export default handleActions(ACTION_HANDLERS, initialState);