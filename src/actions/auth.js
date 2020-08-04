import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect';
import { API } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import uuid from 'uuid/v4';
import { LOGIN, LOAD_USER, UPDATE_USER } from './actions';
import { fulfilled } from '../helpers';

let apiName = 'headwater'
let path = '/user'

// ==================================
// Selectors
// ==================================

export const userSelector = id => createSelector(
    state => state.auth,
    auth => auth.user
);

export const userSessionSelector = createSelector(
    state => state.auth,
    auth => ({
      uid: auth.uid,
      jwt: auth.jwt
    })
);

// ==================================
// Actions
// ==================================
export const signIn = createAction(LOGIN, (credential) => {
    Auth.signIn({
        username: credential.username,
        password: credential.password,
    })
})

export const loadUser = createAction(LOAD_USER, id => {
    return API.get(apiName, `${path + '/' + id}`);
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
    [fulfilled(signIn)]: (state, action) => {
        const { token, id } = action.payload.data
    
        localStorage.setItem('jwt', token)
        localStorage.setItem('uid', id)
        return {
          ...state,
          jwt: token,
          uid: id
        }
    },
    [fulfilled(loadUser)]: (state, action) => ({
        ...state,
        user: action.payload.data
    }),
    [fulfilled(updateUser)]: (state, action) => ({
        ...state,
        user: action.payload.data
    }),
};

// ==================================
// Reducer
// ==================================
const initialState = {
    user: {},
    jwt: '',
    id: ''
};

export default handleActions(ACTION_HANDLERS, initialState);