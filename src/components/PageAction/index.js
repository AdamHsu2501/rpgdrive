import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Grid, CssBaseline, Typography } from '@material-ui/core';

import '../../index.css';
import { withAuthorization } from '../Session';

const styles = theme => ({
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: '1%',
    },
    chip: {
        margin: theme.spacing(0.5),
        maxWidth: '100%',
        minHeight: 32,
        '& span': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
        }
    },
    padding: {
        padding: '20%',
    },
    margin: {
        marginTop: theme.spacing(2)
    }
});

class PageAction extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        window.onbeforeunload = undefined
    }


    render() {
        const { classes, theme } = this.props;
        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <div className="AppContent">
                    <Paper className={classes.pageContent}>
                        <Grid container justify="center" alignItems="center" className={classes.padding} key="loading">
                            <Typography>Please verify your email</Typography>
                        </Grid>
                    </Paper>

                </div>
            </MuiThemeProvider>
        );
    }
}

PageAction.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(PageAction));

