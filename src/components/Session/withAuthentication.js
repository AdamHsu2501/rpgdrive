import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      const { firebase } = this.props;
      const firestore = firebase.app.firestore()
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          firestore.collection('user').doc(authUser.uid).onSnapshot(doc => {
            if (doc.data()) {
              var obj = Object.assign({}, doc.data())
              obj.emailVerified = authUser.emailVerified;
              if (doc.data().level) {
                obj.limit = doc.data().level * Math.pow(1024, 3);
              }
              this.setState({ authUser: obj });
            }
          })
        } else {
          this.setState({ authUser: null })
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
