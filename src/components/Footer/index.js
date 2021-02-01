import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import logo from '../../logoFooter.svg';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    footer: {
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    font: {
        fontWeight: 700,
        marginLeft: theme.spacing(1),
        color: '#b2b2b2'
    },
    link: {
        textDecoration: 'none',
        
    },
    hover: {
        color: '#b2b2b2',
        '&:hover': {
            color: '#fff',
        },
    },
    margin: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    }
});

class FooterMenu extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container alignItems="center" className={classes.footer}>
                <Grid item xs={7} sm={4}>
                    <Link to={ROUTES.HOME} className={classes.link}>
                        <Grid container alignItems="center">
                            <img src={logo} alt="home" style={{ height: '40px' }} />
                            <Typography variant="h5" className={classes.font}>RPG drive</Typography>
                        </Grid>
                    </Link>
                </Grid>

                <Grid item container xs={5} sm={4} justify="center" alignItems="center">
                    <Link to={ROUTES.TERMS} className={classes.link}>
                        <Typography className={classes.hover}>Terms</Typography>
                    </Link>

                    <Typography variant="h5" className={classes.margin}>·</Typography>

                    <Link to={ROUTES.PRIVACY} className={classes.link}>
                        <Typography className={classes.hover}>Privacy</Typography>
                    </Link>
                </Grid>

                <Grid item container sm={4} />
            </Grid>
        );
    }
}

FooterMenu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FooterMenu));