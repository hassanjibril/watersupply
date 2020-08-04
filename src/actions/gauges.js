import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_GAUGES, LOAD_GAUGE, ADD_GAUGE, DELETE_GAUGE, UPDATE_GAUGE } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/gauge'

// ==================================
// Selectors
// ==================================
export const gaugeListSelector = createSelector(
    state => state.gauges,
    gauges => gauges.list
);

export const gaugeSelector = id => createSelector(
    state => state.gauges,
    gauges => gauges.list.find(gauge => gauge.id === id)
);

// ==================================
// Actions
// ==================================
export const loadGauges = createAction(LOAD_GAUGES, () => {
    return API.get(apiName, path);
});

export const loadGauge = createAction(LOAD_GAUGE, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createGauge = createAction(ADD_GAUGE, gaugeData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...gaugeData
        }
    });
});

export const deleteGauge = createAction(DELETE_GAUGE, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updateGauge = createAction(UPDATE_GAUGE, gaugeData => {
    return API.put(apiName, path, {
        body: gaugeData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadGauges)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadGauge)]: (state, action) => ({
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