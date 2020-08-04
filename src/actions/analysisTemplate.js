import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_ANALYSISTEMPLATES, LOAD_ANALYSISTEMPLATE, ADD_ANALYSISTEMPLATE, DELETE_ANALYSISTEMPLATE, UPDATE_ANALYSISTEMPLATE } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/analysisTemplate'

// ==================================
// Selectors
// ==================================
export const analysisTemplateListSelector = createSelector(
    state => state.analysisTemplates,
    analysisTemplates => analysisTemplates.list
);

export const analysisTemplateSelector = id => createSelector(
    state => state.analysisTemplates,
    analysisTemplates => analysisTemplates.list.find(analysisTemplate => analysisTemplate.id === id)
);

// ==================================
// Actions
// ==================================
export const loadAnalysisTemplates = createAction(LOAD_ANALYSISTEMPLATES, () => {
    return API.get(apiName, path);
});

export const loadAnalysisTemplate = createAction(LOAD_ANALYSISTEMPLATE, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createAnalysisTemplate = createAction(ADD_ANALYSISTEMPLATE, analysisTemplateData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...analysisTemplateData
        }
    });
});

export const deleteAnalysisTemplate = createAction(DELETE_ANALYSISTEMPLATE, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateAnalysisTemplate = createAction(UPDATE_ANALYSISTEMPLATE, analysisTemplateData => {
    return API.put(apiName, path, {
        body: analysisTemplateData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadAnalysisTemplates)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadAnalysisTemplate)]: (state, action) => ({
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