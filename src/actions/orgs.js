import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_ORGS, LOAD_ORG, ADD_ORG, DELETE_ORG, UPDATE_ORG } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/organization'

// ==================================
// Selectors
// ==================================
export const orgListSelector = createSelector(
    state => state.orgs,
    orgs => orgs.list
);

export const orgSelector = id => createSelector(
    state => state.orgs,
    orgs => orgs.list.find(org => org.id === id)
);

// ==================================
// Actions
// ==================================
export const loadOrgs = createAction(LOAD_ORGS, () => {
    return API.get(apiName, path);
});

export const loadOrg = createAction(LOAD_ORG, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createOrg = createAction(ADD_ORG, orgData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...orgData
        }
    });
});

export const deleteOrg = createAction(DELETE_ORG, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateOrg = createAction(UPDATE_ORG, orgData => {
    return API.put(apiName, path, {
        body: orgData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadOrgs)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadOrg)]: (state, action) => ({
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