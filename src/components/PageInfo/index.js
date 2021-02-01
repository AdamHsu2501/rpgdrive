import React, { Component } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import {
    Paper, Grid, CssBaseline, Typography, CircularProgress,
    TextField, InputAdornment, Button, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Tabs, Tab,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import NumberFormat from 'react-number-format';
import { FaPaypal } from 'react-icons/fa';

import '../../index.css';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: theme.spacing(3),
    },
    margin: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    input: {
        display: 'flex',
        backgroundColor: '#000',
        borderRadius: 4,
        height: 'auto',
    },
    btn: {
        margin: theme.spacing(1),
        color: theme.palette.common.white,
        textTransform: 'none'
    },
    load: {
        marginRight: theme.spacing(1),
        color: theme.palette.common.white
    },
    icon: {
        fontSize: 30,
        margin: theme.spacing(1)
    },
    padding: {
        padding: theme.spacing(3)
    },
    once: {
        backgroundColor: '#03a9f4 !important',
    },
    monthly: {
        backgroundColor: `${theme.palette.secondary.main} !important`,
    },
    toggleBtn: {
        textTransform: 'none'
    },
    title: {
        marginBottom: theme.spacing(2)
    },
    li: {
        fontSize: '1.5rem',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3)
    },
    link: {
        color: '#03a9f4 !important',
    }
});

const INITIAL_STATE = {
    tab: 'main',
    price: 5,
    donateProgress: false,
    success: null,
    email: "",
    message: "",
    sending: false,
    received: false,
    cycle: '1',
};

class PageInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    componentDidMount() {
        const { location } = this.props;
        const search = location.search;

        if (search) {
            const parsed = qs.parse(search, {
                ignoreQueryPrefix: true
            });

            if (parsed.tab) {
                var tab = parsed.tab;
                this.setState({ tab })
            }

            if (parsed.state) {
                const success = parsed.state === 'success' ? true : false;
                this.setState({
                    donateProgress: true,
                    success
                })
            }

        }

        window.onbeforeunload = undefined
    }

    onDonate = () => {
        this.setState({
            donateProgress: true,
        })
    }

    handleClose = () => {
        const { history } = this.props;
        this.setState({
            ...INITIAL_STATE
        }, () => {
            history.push({
                pathname: ROUTES.INFO
            })
        })
    }

    handleMessage = name => e => {
        this.setState({
            [name]: e.target.value,
        })
    }

    handleSend = () => {
        const { firebase } = this.props;
        const { email, message } = this.state;
        const firestore = firebase.app.firestore();


        this.setState({
            sending: true,
        }, () => {
            firestore.collection('contact').add({
                date: new Date(),
                email,
                message
            }).then(() => {
                this.setState({
                    received: true,
                })
            })
        })
    }

    handleCycle = (e, value) => {
        if (value) {
            this.setState({
                cycle: value
            })
        }
    }

    handleTab = (event, value) => {
        const { authUser } = this.props;
        if (value === 'contact' && authUser) {
            this.setState({
                tab: value,
                email: authUser.email
            })
        } else {
            this.setState({ tab: value });
        }
    };


    render() {
        const { classes, theme } = this.props;
        const { price, donateProgress, success, email, message, sending, received, cycle, tab } = this.state;
        var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        var submitBtn = sending ? (
            <Button variant="contained" className={classes.btn} size="large" disabled >
                <CircularProgress size={24} className={classes.load} />
                <Typography>Sending</Typography>
            </Button>
        ) : (
                <Button variant="contained" color="primary" className={classes.btn} size="large" onClick={this.handleSend}>
                    <Typography>Send</Typography>
                </Button>
            )

        var dialogTitle = 'Connecting PayPal', dialogContent = null;
        if (donateProgress) {
            if (success === true) {
                dialogTitle = (
                    <Grid container alignItems="center">
                        <CheckCircleIcon color="primary" className={classes.icon} />
                        <Typography>Success</Typography>
                    </Grid>
                );

                dialogContent = (
                    <Grid container justify="center">
                        <Typography>You are Breathtaking!!</Typography>
                    </Grid>
                );
            } else if (success === false) {
                dialogTitle = (
                    <Grid container alignItems="center">
                        <CancelIcon color="secondary" className={classes.icon} />
                        <Typography>Error</Typography>
                    </Grid>
                );
                dialogContent = (
                    <Grid container justify="center">
                        <Typography>Payment failed.</Typography>
                    </Grid>
                );

            } else {
                dialogContent = (
                    <Grid container alignItems="center">
                        <CircularProgress size={24} className={classes.load} />
                        <Typography>Waiting...</Typography>
                    </Grid>
                );
            }
        }

        var sponsorForm = (
            <form action='https://us-central1-rpggamecenter.cloudfunctions.net/subscribe' method="POST" onSubmit={this.onDonate}>
                <input type="hidden" name="cycle" value={cycle} ></input>
                <Grid container alignItems="center">
                    <NumberFormat
                        customInput={TextField}
                        variant="outlined"
                        name="price"
                        value={price}
                        margin="normal"
                        thousandSeparator={true}
                        allowNegative={false}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        onValueChange={(values) => {
                            const { value } = values;
                            this.setState({ price: value })
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start" >$</InputAdornment>,
                            endAdornment: <InputAdornment position="end">{cycle === '12' && <Typography>/month</Typography>}</InputAdornment>,
                        }}
                    />

                    <Button
                        disabled={price <= 0}
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.btn}
                    >
                        <FaPaypal size={24} /><Typography>Pay with PayPal</Typography>
                    </Button>

                </Grid>
            </form>
        )

        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <div className="AppContent">
                    <Paper className={classes.pageContent}>

                        <Tabs
                            value={tab}
                            onChange={this.handleTab}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Beta" value="main" />
                            <Tab label="Contact" value="contact" />
                            <Tab label="Sponsor" value="sponsor" />
                        </Tabs>

                        {tab === 'contact' && (
                            <Grid container direction="column">
                                <Typography variant="h5" className={classes.title}>Contact</Typography>

                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    value={email}
                                    onChange={this.handleMessage('email')}
                                />

                                <TextField
                                    label="Leave a message..."
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    multiline
                                    rows="4"
                                    rowsMax="20"
                                    value={message}
                                    onChange={this.handleMessage('message')}
                                />

                                {message.replace(/\s/g, '').length && regexEmail.test(email) ? (
                                    <Grid container justify="flex-end">
                                        {submitBtn}
                                    </Grid>
                                ) : null}
                            </Grid>
                        )}

                        {tab === 'main' && (
                            <Grid>
                                <Typography variant="h5" >Account</Typography>
                                <ul>
                                    <li>Unlimited favorites.</li>
                                    <li>3Gib free storage to upload games</li>
                                    <li>One free savefile of each game</li>
                                </ul>
                                <Divider className={classes.margin} />

                                <Typography variant="h5" >Search</Typography>
                                <ul>
                                    <li>You can use multiple keywords to improve accuracy.</li>
                                    <li>Use SPACE to separate keywords.</li>
                                </ul>
                                <Divider className={classes.margin} />

                                <Typography variant="h5" >Platform Fee</Typography>
                                <ul>
                                    <li>The fee is 10% of successfully-processed payments. and is paid by the publisher.</li>
                                    <li>This means that RPGdrive only take money if the publisher is making money.</li>
                                </ul>
                                <Divider className={classes.margin} />

                                <Typography variant="h5" >Refund</Typography>
                                <ul>
                                    <li>From the moment you pay, you can request a refund within 7-days and plays time has to less than 15 minutes.</li>
                                    <li>Please go to ACCOUNT > SHOW ALL TRANSACTIONS > PAYMENT RECORDS to request a refund if you need</li>
                                </ul>
                                <Divider className={classes.margin} />

                                <Typography variant="h5" >Transfer</Typography>
                                <ul>
                                    <li>RPGdrive will temporary hold the funds for 7 days then automatically transfer funds to your PAYPAL account within 1-2 days</li>
                                </ul>
                                <Divider className={classes.margin} />

                                <Typography variant="h5" className={classes.title}>Sponsor</Typography>
                                <ToggleButtonGroup size="small" value={cycle} exclusive onChange={this.handleCycle}>
                                    <ToggleButton value="1" className={classes.toggleBtn} classes={{ selected: classes.once }}>
                                        <Typography>Send me a beer!</Typography>
                                    </ToggleButton>
                                    <ToggleButton value="12" className={classes.toggleBtn} classes={{ selected: classes.monthly }}>
                                        <Typography>Beer me one year!</Typography>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                {sponsorForm}
                            </Grid>
                        )}

                        {tab === 'sponsor' && (
                            <Grid>
                                <Typography variant="h5" className={classes.title}>Sponsor</Typography>
                                <Typography className={classes.margin}>If you like our website, please be our sponsor.</Typography>

                                <ToggleButtonGroup size="small" value={cycle} exclusive onChange={this.handleCycle}>
                                    <ToggleButton value="1" className={classes.toggleBtn} classes={{ selected: classes.once }}>
                                        <Typography>Send me a beer!</Typography>
                                    </ToggleButton>
                                    <ToggleButton value="12" className={classes.toggleBtn} classes={{ selected: classes.monthly }}>
                                        <Typography>Beer me one year!</Typography>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                {sponsorForm}
                            </Grid>
                        )}


                        <Divider className={classes.margin} />
                        <Grid container direction="column" alignContent="center" alignItems="center" className={classes.margin}>
                            <Typography>Thanks for supporting the site!</Typography>
                            <Typography>Enjoy!</Typography>
                            <Typography>-Team RPG drive</Typography>
                        </Grid>
                    </Paper>
                </div>

                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={donateProgress}
                >
                    <DialogTitle id="alert-dialog-title">
                        {dialogTitle}
                    </DialogTitle>
                    <DialogContent>
                        {dialogContent}
                    </DialogContent>
                    <DialogActions>
                        {success !== null && (
                            <Button variant="contained" color="primary" onClick={this.handleClose} className={classes.btn}>
                                <Typography color="textPrimary">Done</Typography>
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth='xs'
                    open={received}
                    onClose={this.handleClose}
                >
                    <DialogTitle id="alert-dialog-title" className={classes.padding}>
                        <Typography align="center" className={classes.btn}>Thank you for your message</Typography>
                    </DialogTitle>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

PageInfo.propTypes = {
    classes: PropTypes.object.isRequired,
};

// const condition = authUser => !!authUser;
const condition = authUser => true;

export default withAuthorization(condition)(withStyles(styles)(PageInfo));

