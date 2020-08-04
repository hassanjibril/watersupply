import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_READINGS, LOAD_READING, ADD_READING, DELETE_READING, UPDATE_READING } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/readings'

// ==================================
// Selectors
// ==================================
export const readingListSelector = createSelector(
    state => state.readings,
    readings => readings.list
);

export const readingSelector = id => createSelector(
    state => state.readings,
    readings => readings.list.find(reading => reading.id === id)
);

// ==================================
// Actions
// ==================================
export const loadReadings = createAction(LOAD_READINGS, () => {
    return API.get(apiName, path);
});

export const loadReading = createAction(LOAD_READING, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createReading = createAction(ADD_READING, readingData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...readingData
        }
    });
});

export const deleteReading = createAction(DELETE_READING, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateReading = createAction(UPDATE_READING, readingData => {
    return API.put(apiName, path, {
        body: readingData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadReadings)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadReading)]: (state, action) => ({
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