import React from 'react'
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router'
import { userSessionSelector } from '../actions/auth';

const PublicRoute = ({
    userSession,
    location,
    render: renderComponent,
    ...rest
}) => {
    const token = userSession.jwt;
    const nextPath =
        location.state &&
        location.state.from &&
        location.state.from.pathname !== '/signin'
        ? location.state.from.pathname
        : '/'

    return (
        <Route
            {...rest}
            render={props =>
                token ? (
                <Redirect
                    to={{
                        pathname: nextPath,
                        state: { from: props.location }
                    }}
                />
            ) : (
                renderComponent()
            )}
        />
    )
};

const mapState = state => ({
    userSession: userSessionSelector(state)
})
export default connect(mapState)(PublicRoute);
