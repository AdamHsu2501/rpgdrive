import React, { Component } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Grid, CircularProgress, CssBaseline, Typography } from '@material-ui/core';

import '../../index.css';
import { withAuthorization } from '../Session';

const styles = theme => ({

});

class PageAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    window.onbeforeunload = undefined
  }

 

  componentWillUnmount() {
  
  }


  render() {
    var { authUser, classes, theme } = this.props;
      return (
        <MuiThemeProvider theme={theme} >
          <CssBaseline />
          <div className="AppContent">
            <Paper className={classes.paper}>
                

            </Paper>

          </div>
        </MuiThemeProvider>
      );
  }
}

PageAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(PageAccount));

