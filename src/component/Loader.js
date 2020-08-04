import React from 'react'
import { connect } from 'react-redux'
import { lifecycle, compose } from 'recompose';

import { isLoading, wasActionDispatchedSuccessfully, getErrorMessage } from '../actions/loading'
import { isArray } from 'util';

const mapState = (state, { action, selector }) => ({
  loading: isLoading(action)(state),
  dispatched: wasActionDispatchedSuccessfully(action)(state),
  result: selector(state),
  error: getErrorMessage(action)(state),
})

const mapDispatch = (dispatch, {
  action
}) => {
  return {
    dispatchAction: params => dispatch(action(params))
  }
}

const Loader = ({ loading, error, result, children }) => (
  loading ? (
    <div>Loading ...</div>
  ) : !result || (isArray(result) && result.length === 0) ? (
    <div>No Data</div>
  ) : error ? (
    <div>Somethign went wrong</div>
  ) : (
    children(result)
  )
)
export default compose(
  connect(mapState, mapDispatch),
  lifecycle({
    componentWillMount () {
      const {
        triggerAction,
        actionParams,
        dispatchAction,
        triggerPolicy,
        dispatched
      } = this.props

      if (triggerAction) {
        if (triggerPolicy && triggerPolicy.triggerOnlyOnce) {
          if (!dispatched) dispatchAction(actionParams)
        } else {
          dispatchAction(actionParams)
        }
      }
    }
  })
)(Loader)
