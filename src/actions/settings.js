import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import { LOAD_SETTING } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/settings'

// ==================================
// Selectors
// ==================================
export const demoOrgListSelector = createSelector(
    state => state.demo_org,
    demo_org => demo_org.list
);
// ==================================
// Actions
// ==================================
export const loadDemoOrgs = createAction(LOAD_SETTING, () => {
    return API.get(apiName, path);
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadDemoOrgs)]: (state, action) => ({
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