import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withAuthentication } from './components/Session'

import * as ROUTES from './constants/routes';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorPage from './components/ErrorPage';
import PageHome from './components/PageHome';
import PageTerms from './components/PageTerms';
import PageAction from './components/PageAction';
import PageGame from './components/PageGame';
import PageTag from './components/PageTag';
import PageInfo from './components/PageInfo';
import PageUpload from './components/PageUpload';
import PageLike from './components/PageLike';
import PageAccount from './components/PageAccount';
import PageSignIn from './components/PageSignIn';


const App = () => {
  if (window.top.location !== document.location) {
    window.top.location.href = document.location.href;
  }

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flexShrink: 0 }}>
          <Navigation />
        </div>

        <div style={{ flexGrow: 1 }}>
          <Switch>
            <Route exact path={ROUTES.HOME} component={PageHome} />
            <Route exact path={ROUTES.TERMS} component={PageTerms} />
            <Route exact path={ROUTES.PRIVACY} component={PageTerms} />
            <Route exact path={ROUTES.ACTION} component={PageAction} />
            <Route exact path={ROUTES.GAME} component={PageGame} />
            <Route exact path={ROUTES.TAGS} component={PageTag} />
            <Route exact path={ROUTES.INFO} component={PageInfo} />
            <Route exact path={ROUTES.UPLOAD} component={PageUpload} />
            <Route exact path={ROUTES.FAVORITE} component={PageLike} />
            <Route exact path={ROUTES.ACCOUNT} component={PageAccount} />
            <Route exact path={ROUTES.SIGN_IN} component={PageSignIn} />

            <Route component={ErrorPage} />
          </Switch>
        </div>

        <div style={{ flexShrink: 0 }}>
          <Footer />
        </div>
      </div>
    </Router >
  );
}

export default withAuthentication(App);
