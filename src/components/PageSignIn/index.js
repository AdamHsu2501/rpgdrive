import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Grid, Paper, CssBaseline, Typography } from '@material-ui/core';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import logo from '../../logo.svg';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
  img: {
    width: 150,
    marginTop: theme.spacing(7),
    marginBottom: theme.spacing(2),
  },
  paper: {
    width: "50%",
    padding: theme.spacing(2),
  }
});

class PageSignIn extends Component {

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      this.props.firebase.app.auth.GoogleAuthProvider.PROVIDER_ID,
      this.props.firebase.app.auth.FacebookAuthProvider.PROVIDER_ID,
      this.props.firebase.app.auth.TwitterAuthProvider.PROVIDER_ID,
      {
        provider: this.props.firebase.app.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        var isNewUser = authResult.additionalUserInfo.isNewUser;
        const { firebase, history } = this.props;
        const firestore = firebase.app.firestore();
        var user = authResult.user;
        var ref = firestore.collection('user').doc(user.uid);
        var date = new Date();
        var obj = isNewUser ? {
          create: date,
          displayName: user.displayName,
          email: user.email,
          introduction: null,
          level: 3,
          paypal: null,
          photoURL: user.photoURL,
          uid: user.uid,
          last: date
        } : {
            last: date
          }


        ref.set(obj, { merge: true }).then(() => {
          if(user.emailVerified){
            history.push({
              pathname: ROUTES.HOME
            })
          }else{
            return user.sendEmailVerification({
              url: `https://rpgdrive.ga${ROUTES.SIGN_IN}`
            }).then(() => {
              history.push({
                pathname: ROUTES.ACTION
              })
            });
          }
        })

        return false;
      },

      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    signInSuccessUrl: ROUTES.HOME,

    tosUrl: ROUTES.TERMS,
    privacyPolicyUrl: function () {
      window.location.assign(ROUTES.PRIVACY);
    }
  };

  componentDidMount() {
    window.onbeforeunload = undefined
  }

  render() {
    const { firebase, theme, classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Grid container direction="column" justify="center" alignItems="center">
          <img src={logo} alt="logo" className={classes.img} />
          <Paper className={classes.paper}>
            <Typography id="loader" >Loading...</Typography>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.app.auth()} />
          </Paper>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

PageSignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withFirebase,
)(withStyles(styles)(PageSignIn));;

