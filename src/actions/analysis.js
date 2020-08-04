import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_ANALYSISES, LOAD_ANALYSIS, ADD_ANALYSIS, DELETE_ANALYSIS, UPDATE_ANALYSIS } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/waterAnalysis'

// ==================================
// Selectors
// ==================================
export const analysisListSelector = createSelector(
    state => state.analysises,
    analysises => analysises.list
);

export const analysisSelector = id => createSelector(
    state => state.analysises,
    analysises => analysises.list.find(analysis => analysis.id === id)
);

// ==================================
// Actions
// ==================================
export const loadAnalysises = createAction(LOAD_ANALYSISES, () => {
    return API.get(apiName, path);
});

export const loadAnalysis = createAction(LOAD_ANALYSIS, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createAnalysis = createAction(ADD_ANALYSIS, analysisData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...analysisData
        }
    });
});

export const deleteAnalysis = createAction(DELETE_ANALYSIS, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateAnalysis = createAction(UPDATE_ANALYSIS, analysisData => {
    return API.put(apiName, path, {
        body: analysisData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadAnalysises)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadAnalysis)]: (state, action) => ({
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