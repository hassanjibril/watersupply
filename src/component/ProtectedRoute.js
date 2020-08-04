import React from 'react'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router'
import Loader from './Loader';
import { loadUser, userSelector, userSessionSelector } from '../actions/auth';

const ProtectedRoute = ({
    userSession,
    render: renderComponent,
    component: Component,
    ...restProps
}) => {
    const token = userSession.jwt;

    return (
        <Route
        {...restProps}
        render={props =>
            token ? (
                <Loader
                    action={loadUser}
                    selector={userSelector}
                    triggerAction
                    triggerPolicy={{
                        triggerOnlyOnce: true
                    }}
                >
                    {user => {
                        if (user) {
                            return renderComponent(props)
                        } else {
                            localStorage.removeItem('jwt');
                            return <Redirect
                                to={{
                                    pathname: '/',
                                    state: { from: props.location }
                                }}
                            />
                        }
                    }}
                </Loader>
            ) : (
                <Redirect
                    to={{
                        pathname: '/',
                        state: { from: props.location }
                    }}
                />
            )
        }
        />
    )
};

const mapState = state => ({
    userSession: userSessionSelector(state)
})
export default connect(mapState)(ProtectedRoute);
