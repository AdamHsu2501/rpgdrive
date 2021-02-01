import React, { Component } from 'react';
import qs from 'qs';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import {
    Avatar, Grid, CircularProgress, CssBaseline, Typography, Button, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stepper, Step, StepLabel, StepContent, LinearProgress, Paper,
    TextField, MenuItem
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
//import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { FaPaypal } from 'react-icons/fa';

import '../../index.css';
import { withAuthorization } from '../Session';
import AccountItem from '../List/AccountItem';
import TransactionTable from '../List/TransactionTable';
import { formatBytes } from '../List/NumberFormat';
import logo from '../../logoFooter.svg';

const styles = theme => ({
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: '1%',
    },
    avatar: {
        margin: theme.spacing(3),
        width: 60,
        height: 60,
    },
    img: {
        display: 'block',
        width: '100%',
    },
    load: {
        marginRight: theme.spacing(1),
    },
    paper: {
        width: '100%',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    select: {
        width: 200
    },
    margin: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    }
});

class PageAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isSelf: false,
            list: [],
            size: 0,
            isSubscribe: false,
            subscriber: 0,
            deleteProgress: false,
            step: 0,
            editProgress: false,
            updating: false,
            activityProgress: false,
            selectId: null,
            target: null,
            targetId: null,
        }
    }

    componentDidMount() {
        this.getAccount();
    }

    componentDidUpdate(prevProps) {
        if (this.state.deleteProgress) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }

        if (prevProps.location.key !== this.props.location.key) {
            this.getAccount();
        }
    }

    componentWillUnmount() {
        if(this.stop){
            this.stop()
        }
        this.isUnmounted = true;
    }

    getAccount = async () => {
        const { authUser, firebase } = this.props;
        const firestore = firebase.app.firestore();
        const parsed = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        });
        const id = parsed.id;

        var isSelf, isSubscribe, user, subscriber;

        if (id) {

            const userRef = firestore.collection('user');
            isSelf = false;


            await userRef.doc(id).get().then(doc => {
                if (this.isUnmounted) {
                    return;
                }
                return user = Object.assign({}, doc.data())
            });

            await userRef.doc(authUser.uid).collection('subscribe').doc(id).get().then(doc => {
                if (this.isUnmounted) {
                    return;
                }
                return isSubscribe = doc.empty ? false : true;
            })



        } else {
            isSelf = true;
            isSubscribe = false;
            user = authUser;
        }

        await firestore.collectionGroup('subscribe').where("uid", "==", user.uid).get().then(docs => {
            if (this.isUnmounted) {
                return;
            }
            subscriber = docs.size;
            
            if (!isSelf && !docs.empty) {
                docs.forEach(doc => {
                    if (doc.data().from === authUser.uid) {
                        isSubscribe = true;
                    }
                })
            }
        })

        this.setState({
            user,
            isSelf,
            isSubscribe,
            subscriber
        }, () => {
            this.getList(user.uid);
        })
    }

    getList = (id) => {
        const { firebase } = this.props;
        const firestore = firebase.app.firestore();
        // const ref = firestore.collection('game').where("uploader", "==", id).where("complete", "==", true).where("error", "==", false).orderBy('update', 'desc');
        const ref = firestore.collection('game').where("uploader", "==", id).orderBy('update', 'desc');

        return this.stop = ref.onSnapshot(docs => {
            if (this.isUnmounted) {
                return;
            }
            var size = 0;
            const list = [];

            if (!docs.empty) {
                docs.forEach(doc => {
                    const obj = Object.assign({}, doc.data());
                    list.push(obj);
                    size += doc.data().size
                });
            }

            this.setState({
                list,
                size
            });

        });

    }

    onSubscribe = () => {
        const { firebase, authUser } = this.props;
        const { user } = this.state;
        var firestore = firebase.app.firestore();

        var obj = {
            uid: user.uid,
            name: user.displayName,
            from: authUser.uid,
        }

        if (user.avatar) {
            obj.avatar = user.avatar;
        }

        firestore.collection('user').doc(authUser.uid).collection('subscribe').doc(user.uid).set({
            ...obj,
            date: firebase.app.firestore.FieldValue.serverTimestamp(),
        }, { merge: true }).then(() => {
            this.setState({
                isSubscribe: true,
                subscriber: this.state.subscriber + 1,
            });
        })
    }

    unSubscribe = () => {
        const { firebase, authUser } = this.props;
        const { user } = this.state;
        var firestore = firebase.app.firestore();
        firestore.collection('user').doc(authUser.uid).collection('subscribe').doc(user.uid).delete().then(() => {
            this.setState({
                isSubscribe: false,
                subscriber: this.state.subscriber - 1,
            });
        })
    }

    onDelete = (id) => {
        const { firebase } = this.props;

        this.setState({
            deleteProgress: true,
        }, () => {
            var deleteProcess = firebase.app.functions().httpsCallable('deleteProcess')
            deleteProcess({ id }).then(result => {
                this.setState(state => ({
                    step: state.step + 1,
                }));
            })
        })
    }

    handleSelect = name => e => {
        const { authUser } = this.props;
        var value = e.target.value, target, targetId;
        if (value === 'payer' || value === 'payee') {
            target = value;
            targetId = authUser.uid;
        } else {
            target = 'game';
            targetId = value;
        }
        this.setState({
            [name]: e.target.value,
            target,
            targetId
        })
    }

    onActivity = name => e => {
        const { authUser } = this.props;
        var id, selectId;
        if (name === 'game') {
            id = e;
            selectId = e;
        }

        if (name === 'payee') {
            id = authUser.uid;
            selectId = name
        }

        this.setState({
            activityProgress: true,
            selectId,
            target: name,
            targetId: id
        })
    }



    handleClose = () => {
        this.setState({
            deleteProgress: false,
            step: 0,
        })
    }

    onEdit = () => {
        this.setState({
            editProgress: true
        })
    }

    handleChange = name => e => {
        this.setState({
            [name]: e.target.value
        });
    };

    // updateProfile = () => {
    //     const { authUser, firebase } = this.props;
    //     const firestore = firebase.app.firestore();
    //     this.setState({
    //         updating: true,
    //     }, () => {
    //         firestore.collection('user').doc(authUser.uid).update({
    //         }).then(() => {
    //             this.setState({
    //                 editProgress: false,
    //                 updating: false,
    //             })
    //         })
    //     })
    // }

    removePaypal = () => {
        const { authUser, firebase } = this.props;
        const firestore = firebase.app.firestore();
        firestore.collection('user').doc(authUser.uid).update({
            paypal: null
        })
    }

    render() {
        const { authUser, classes, theme } = this.props;
        const {
            user, list, size, subscriber, isSelf, isSubscribe, deleteProgress, step,
            editProgress, updating, paypal, activityProgress, selectId, target, targetId
        } = this.state;
        var content, subscribeBtn, /*editBtn,*/ paypalContent;

        if (isSelf) {
            // editBtn = (<IconButton onClick={this.onEdit} ><SettingsIcon /></IconButton>)
            if (!authUser.paypal) {
                paypalContent = (
                    <form action='https://us-central1-rpggamecenter.cloudfunctions.net/permission' method="POST">
                        <Button
                            variant="outlined"
                            name="uid"
                            value={authUser.uid}
                            type="submit"
                        >
                            <FaPaypal size={24} /> Add Business or Premier PayPal Account
                        </Button>
                    </form>
                )
            } else {
                paypalContent = (
                    <Grid container justify="space-between" alignItems="center">
                        <Typography>{authUser.paypal}</Typography>
                        <IconButton
                            onClick={this.removePaypal}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                )
            }
        } else {
            subscribeBtn = isSubscribe ? (
                <Button variant="contained" color="secondary" className={classes.btn} onClick={this.unSubscribe} ><FavoriteIcon className={classes.margin} />subscribed</Button>
            ) : (
                    <Button variant="outlined" className={classes.btn} onClick={this.onSubscribe} ><FavoriteBorderIcon className={classes.margin} />subscribe</Button>
                );
        }


        if (user) {
            content = (
                <Grid container direction="row" alignItems="center" >
                    <Grid item container justify="flex-end" xs={3} sm>
                        <Avatar src={user.photoURL? user.photoURL : logo} className={classes.avatar} />
                    </Grid>

                    <Grid item container direction="column" xs sm>
                        <Grid container justify="space-between">
                            <Typography variant="h4">{user.displayName}</Typography>
                            {/* {editBtn} */}
                        </Grid>

                        {paypalContent}


                        <Grid container direction="row" className={classes.margin}>
                            <Grid item xs><Typography >{list.length} games</Typography></Grid>
                            <Grid item xs><Typography >{subscriber} subscriber</Typography></Grid>
                        </Grid>
                    </Grid>

                    <Grid item container justify="center" xs={12} sm>
                        {subscribeBtn}
                    </Grid>

                </Grid>
            )
        }

        var percent = size / authUser.limit * 100;

        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <Prompt
                    key='block-nav'
                    when={deleteProgress}
                    message='Are you sure you want to leave?'
                />

                <div className="AppContent">
                    <Grid container className={classes.pageContent} >
                        {content}

                        {isSelf && (
                            <Paper className={classes.paper}>
                                <Typography variant="h5" >Storage usage</Typography>
                                <Grid container direction="column" className={classes.margin}>
                                    <LinearProgress variant="buffer" value={percent} valueBuffer={percent} />
                                    <Grid container>
                                        <Typography>Usage: {parseFloat(percent.toFixed(2))}%</Typography>
                                        <Typography color="textSecondary">( {formatBytes(size, 2)} / {formatBytes(authUser.limit, 2)} )</Typography>
                                    </Grid>
                                </Grid>


                                <Grid container justify="flex-end" >
                                    <Button onClick={this.onActivity('payee')}>show all transactions</Button>
                                </Grid>

                            </Paper>
                        )}

                        <Grid container direction="column" >
                            {list.map(item =>
                                <AccountItem
                                    key={item.uid}
                                    item={item}
                                    authUser={authUser}
                                    isSelf={isSelf}
                                    onDelete={this.onDelete}
                                    onActivity={this.onActivity('game')}
                                />
                            )}

                        </Grid>

                    </Grid>
                </div>

                <Dialog
                    fullWidth
                    maxWidth='sm'
                    onClose={() => this.setState({ editProgress: false })}
                    open={editProgress}
                >
                    <DialogTitle id="alert-dialog-title">Edit profile</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Paypal Account"
                            value={paypal}
                            onChange={this.handleChange('paypal')}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        {updating ? (
                            <Button variant="contained" color="primary" className={classes.btn} disabled >
                                <CircularProgress size={24} className={classes.load} /><Typography color="textPrimary">submitting</Typography>
                            </Button>
                        ) : (
                                <Button variant="contained" color="primary" className={classes.btn} >
                                    <Typography color="textPrimary">submit</Typography>
                                </Button>
                            )}
                    </DialogActions>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={deleteProgress}
                >
                    <DialogTitle id="alert-dialog-title">Delete progress</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={step} orientation="vertical">
                            <Step key={0}>
                                <StepLabel>Delete game data</StepLabel>
                                <StepContent>
                                    <Grid container alignItems="center">
                                        <CircularProgress size={24} className={classes.load} />
                                        <Typography>Deleting...</Typography>
                                    </Grid>
                                </StepContent>
                            </Step>
                        </Stepper>
                    </DialogContent>
                    <DialogActions>
                        {step === 1 && (
                            <Button variant="contained" color="primary" onClick={this.handleClose} className={classes.btn}>
                                <Typography color="textPrimary">Done</Typography>
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth='lg'
                    onClose={() => this.setState({ activityProgress: false })}
                    open={activityProgress}
                >
                    <DialogTitle id="alert-dialog-title">Transaction records</DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            value={selectId}
                            className={classes.select}
                            onChange={this.handleSelect('selectId')}
                            margin="normal"
                            variant="outlined"
                        >
                            <MenuItem key='payer' value="payer">
                                Payment records
                            </MenuItem>
                            <MenuItem key='payee' value='payee'>
                                All sales records
                            </MenuItem>
                            {list.map(option => (
                                <MenuItem key={option.uid} value={option.uid}>
                                    {option.displayName}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TransactionTable id={targetId} target={target} />
                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </Dialog>
            </MuiThemeProvider >
        );
    }
}

PageAccount.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(PageAccount));

