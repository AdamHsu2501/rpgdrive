import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { red, pink, lightBlue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: lightBlue[300],
      main: lightBlue[500],
      dark: lightBlue[700],
      // contrastText: lightBlue[500],
    },
    secondary: {
      light: pink[300],
      main: pink[500],
      dark: pink[700],
      // contrastText: '#fff',
    },
    error: {
      light: red[300],
      main: red[500],
      dark: red[700],
      // contrastText: red[500],
    },
    background:{
      paper: '#1f1f1f',
      default: '#0d0d0d'
    },
    
    type: 'dark'
  },
});

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} theme={theme} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
