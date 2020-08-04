import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_NEWSES, LOAD_NEWS, ADD_NEWS, DELETE_NEWS, UPDATE_NEWS } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/news'

// ==================================
// Selectors
// ==================================
export const newsListSelector = createSelector(
    state => state.newses,
    newses => newses.list
);

export const newsSelector = id => createSelector(
    state => state.newses,
    newses => newses.list.find(news => news.id === id)
);

// ==================================
// Actions
// ==================================
export const loadNewses = createAction(LOAD_NEWSES, () => {
    return API.get(apiName, path);
});

export const loadNews = createAction(LOAD_NEWS, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createNews = createAction(ADD_NEWS, newsData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...newsData
        }
    });
});

export const deleteNews = createAction(DELETE_NEWS, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateNews = createAction(UPDATE_NEWS, newsData => {
    return API.put(apiName, path, {
        body: newsData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadNewses)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadNews)]: (state, action) => ({
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