import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOAD_PAYMENTS, LOAD_PAYMENT, ADD_PAYMENT, DELETE_PAYMENT, UPDATE_PAYMENT } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/payment'

// ==================================
// Selectors
// ==================================
export const paymentListSelector = createSelector(
    state => state.payments,
    payments => payments.list
);

export const paymentSelector = id => createSelector(
    state => state.payments,
    payments => payments.list.find(payment => payment.id === id)
);

// ==================================
// Actions
// ==================================
export const loadPayments = createAction(LOAD_PAYMENTS, () => {
    return API.get(apiName, path);
});

export const loadPayment = createAction(LOAD_PAYMENT, id => {
    return API.get(apiName, `${path + '/' + id}`);
});

export const createPayment = createAction(ADD_PAYMENT, paymentData => {
    return API.post(apiName, path, {
        body: {
            id: uuid(),
            ...paymentData
        }
    });
});

export const deletePayment = createAction(DELETE_PAYMENT, id => {
    return API.del(apiName, `${path + '/object/' + id}`);
});

export const updatePayment = createAction(UPDATE_PAYMENT, paymentData => {
    return API.put(apiName, path, {
        body: paymentData
    });
});

// ==================================
// Action Handlers
// ==================================
const ACTION_HANDLERS = {
    [fulfilled(loadPayments)]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [fulfilled(loadPayment)]: (state, action) => ({
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