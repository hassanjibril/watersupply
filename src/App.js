import React from 'react';

import Amplify from 'aws-amplify';
import awsConfig from './aws-exports';

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import './index.css';
import LandingLayout from "./layouts/LandingLayout";
import { MainLayout } from "./layouts/MainLayout";

import HomeLanding from "./pages/HomeLanding";
import Member from "./pages/MemberPage";
import EditMember from "./pages/MemberPage/EditMember";
import Organization from "./pages/OrganizationPage";
import Dashboard from './pages/DashboardPage/Dashboard';
import Readings from './pages/ReadingsPage/Readings';
import Invoices from './pages/InvoicesPage/Invoices';
import WaterAccess from './pages/WaterAccessPage/WaterAccess';
import EditWaterAccess from './pages/WaterAccessPage/EditWaterAccess';
import EditGauge from './pages/GaugesPage/EditGauge';
import Billing from './pages/BillingPage/Billing';
import Equipment from './pages/EquipmentPage/Equipment';
import Gauges from './pages/GaugesPage/Gauges';
import PaymentTerms from './pages/PaymentTermsPage/PaymentTerms';
import EditPayment from './pages/PaymentTermsPage/EditPaymentTerms';
import OrganizationSettings from './pages/OrganizationSettingsPage/OrganizationSettings';
import Language from './pages/LanguageSettingPage/Language';
import AnalysisTemplate from './pages/AnalysisTemplatePage';
import WaterAnalysis from './pages/WaterAnalysisPage';
import News from './pages/NewsPage';
import EditNews from './pages/NewsPage/EditNews';
import EditWaterAnalysis from './pages/WaterAnalysisPage/EditWaterAnalysis';
import EditAnalysisTemplate from './pages/AnalysisTemplatePage/EditAnalysisTemplate';

import { TranslatorProvider } from "react-translate"
import translations from './translations.js';

const renderWithLayout = (Component, Layout) => <Layout>{Component}</Layout>;
const lang = localStorage.getItem("lang") ?  localStorage.getItem("lang") : "de";
Amplify.configure(awsConfig);

const App = ({ history }) => {
  return (
    <TranslatorProvider translations={translations}>
      <Router history={history} lang={lang}>
        <Switch>
          <Route
            path="/"
            exact
            render={() => renderWithLayout(<HomeLanding lang={lang}/>, LandingLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/member"
            exact
            render={() => renderWithLayout(<Member lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editMember/:id"
            exact
            render={props => renderWithLayout(<EditMember {...props} lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/organization"
            exact
            render={() => renderWithLayout(<Organization lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 2, 3]}
            path="/dashboard"
            exact
            render={() => renderWithLayout(<Dashboard lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 2, 3]}
            path="/readings"
            exact
            render={() => renderWithLayout(<Readings  lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 2, 3]}
            path="/invoices"
            exact
            render={() => renderWithLayout(<Invoices lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/wateraccess"
            exact
            render={() => renderWithLayout(<WaterAccess lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/analysisTemplate"
            exact
            render={() => renderWithLayout(<AnalysisTemplate lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editAnalysisTemplate/:id"
            exact
            render={props => renderWithLayout(<EditAnalysisTemplate {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/wateranalysis"
            exact
            render={() => renderWithLayout(<WaterAnalysis lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editWaterAnalysis/:id"
            exact
            render={props => renderWithLayout(<EditWaterAnalysis {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editwateraccess/:id"
            exact
            render={props => renderWithLayout(<EditWaterAccess {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/billing"
            exact
            render={() => renderWithLayout(<Billing lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/news"
            exact
            render={() => renderWithLayout(<News lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editNews/:id"
            exact
            render={props => renderWithLayout(<EditNews {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/equipment"
            exact
            render={() => renderWithLayout(<Equipment lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/gauges"
            exact
            render={() => renderWithLayout(<Gauges lang={lang}/>, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editGauges/:id"
            exact
            render={props => renderWithLayout(<EditGauge {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/paymentterms"
            exact
            render={() => renderWithLayout(<PaymentTerms lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/editPaymentTerms/:id"
            exact
            render={props => renderWithLayout(<EditPayment {...props} lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 3]}
            path="/organizationsettings"
            exact
            render={() => renderWithLayout(<OrganizationSettings lang={lang} />, MainLayout)}
          />
          <PrivateRoute
            role={[0, 1, 2, 3]}
            path="/language"
            exact
            render={() => renderWithLayout(<Language lang={lang} />, MainLayout)}
          />
        />
        </Switch>
      </Router>
    </TranslatorProvider>
  )
}
const PrivateRoute = ({ isAuthenticated, role, ...rest }) => {
  if(localStorage.getItem('jwt') !== null) {
    if (role.includes(parseInt(localStorage.getItem('role')))) {
      return (<Route {...rest} />) 
    } else {
      return (<Redirect to={{
        pathname: '/dashboard',
        state: { from: rest.location }
      }} />)
    }
      
      
     
  } else {
    return (
      <Redirect to={{
        pathname: '/',
        state: { from: rest.location }
      }} />
    )
  }
}

export default App