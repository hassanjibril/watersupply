import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_TEMPLATELISTS, LOAD_TEMPLATELIST, ADD_TEMPLATELIST, DELETE_TEMPLATELIST, UPDATE_TEMPLATELIST } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/templateList'

// ==================================
// Selectors
// ==================================
export const templateListSelector = createSelector(
    state => state.templateLists,
    templateLists => templateLists.list
);

export const templateSelector = id => createSelector(
    state => state.templateLists,
    templateLists => templateLists.list.find(analysisTemplate => analysisTemplate.id === id)
);

// ==================================
// Actions
// ==================================
export const loadTemplateLists = createAction(LOAD_TEMPLATELISTS, () => {
    return API.get(apiName, path);
});

export const loadTemplateList = createAction(LOAD_TEMPLATELIST, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createTemplateList = createAction(ADD_TEMPLATELIST, templateListData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...templateListData
        }
    });
});

export const deleteTemplateList = createAction(DELETE_TEMPLATELIST, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateTemplateList = createAction(UPDATE_TEMPLATELIST, templateListData => {
    return API.put(apiName, path, {
        body: templateListData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadTemplateLists)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadTemplateList)]: (state, action) => ({
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