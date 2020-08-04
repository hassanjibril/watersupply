import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_USERS, LOAD_USER, ADD_USER, DELETE_USER, UPDATE_USER } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/user'

// ==================================
// Selectors
// ==================================
export const userListSelector = createSelector(
    state => state.users,
    users => users.list
);

export const userSelector = id => createSelector(
    state => state.users,
    users => users.list.find(user => user.id === id)
);

// ==================================
// Actions
// ==================================
export const loadUsers = createAction(LOAD_USERS, () => {
    return API.get(apiName, path);
});

export const loadUser = createAction(LOAD_USER, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createUser = createAction(ADD_USER, userData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...userData
        }
    });
});

export const deleteUser = createAction(DELETE_USER, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateUser = createAction(UPDATE_USER, userData => {
    return API.put(apiName, path, {
        body: userData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadUsers)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadUser)]: (state, action) => ({
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