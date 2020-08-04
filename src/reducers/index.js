import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appReducer from '../actions/app';
import orgsReducer from '../actions/orgs';
import usersReducer from '../actions/users';
import demoOrgReducer from '../actions/settings';
import gaugeReducer from '../actions/gauges';
import accessReducer from '../actions/accesses';
import paymentReducer from "../actions/payment";
import readingReducer from "../actions/readings";
import newsReducer from "../actions/news";
import analysisTemplateReducer from "../actions/analysisTemplate";
import analysisReducer from "../actions/analysis";
import templateListReducer from '../actions/templateLists';
import loadingReducer from '../actions/loading';

export const rootReducer = asyncReducers => {
  const reducers = {
    router: routerReducer,
    app: appReducer,
    orgs: orgsReducer,
    demo_org: demoOrgReducer,
    users: usersReducer,
    gauges: gaugeReducer,
    accesses: accessReducer,
    payments: paymentReducer,
    readings: readingReducer,
    newses: newsReducer,
    analysisTemplates: analysisTemplateReducer,
    analysises: analysisReducer,
    templateLists: templateListReducer,
    loading: loadingReducer,
    ...asyncReducers
  };
  return combineReducers(reducers);
};

export default rootReducer;