import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, CircularProgress, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@material-ui/core';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import logo from '../../logoFooter.svg';

const styles = theme => ({
    root: {
        padding: theme.spacing(1),
    },
    marginTop: {
        marginTop: theme.spacing(1),
    },
    marginLeft: {
        marginLeft: theme.spacing(1),
    },
    inputDiv: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(9),
    },
    avatar: {
    },
    textField: {
        width: '100%',
    },
    link: {
        textDecoration: 'none',
        fontSize: 20,
        color: 'white',
        marginRight: theme.spacing(1),
    },
    btn: {
        marginTop: theme.spacing(1),
    },
    progress: {
        color: theme.palette.common.white,
        marginRight: theme.spacing(1),
    },
    p: {
        whiteSpace: 'pre-wrap',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    commentMargin: {
        marginBottom: theme.spacing(3),
    },
    replyComment: {
        marginLeft: theme.spacing(7),
    },
    padding: {
        paddingRight: theme.spacing(1),
    },
    divider: {
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
    },
    pointer: {
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
});

const INITIAL_STATE = {
    list: [],
    size: 0,
    num: 100,
    hasMore: true,
    lastVisible: null,

    submitting: false,
    value: '',
    visible: false,
    reply: null,
    edit: null,
};

class Item extends Component {
    render() {
        const { classes, item, authUser, onEdit, onReply } = this.props;
        return (
            <Grid container direction="column" >
                <Grid container alignItems="flex-start" className={classes.commentMargin}>

                    <Link to={{ pathname: ROUTES.ACCOUNT, search: `?id=${item.uid}` }} className={classes.link}>
                        <Avatar src={item.photoURL ? item.photoURL : logo} className={classes.avatar} />
                    </Link>


                    <Grid item container direction="column" xs>
                        <Grid container alignItems="flex-end" >
                            <Grid>
                                <Link to={{ pathname: ROUTES.ACCOUNT, search: `?id=${item.uid}` }} className={classes.link}>{item.displayName}</Link>
                            </Grid>

                            <Typography color="textSecondary">{moment(item.date).fromNow()}</Typography>
                        </Grid>

                        <Typography className={classes.p}>{item.text}</Typography>

                        <Grid container>
                            <Typography color="textSecondary" id={item.id} onClick={() => onReply(item.id)} className={classes.pointer} >
                                Reply
                            </Typography>
                            {item.uid === authUser.uid && <Typography className={classes.divider} >|</Typography>}
                            {item.uid === authUser.uid && (
                                <Typography color="textSecondary" onClick={() => onEdit(item.id)} className={classes.pointer} >Edit</Typography>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className={classes.replyComment} >
                    {item.comments.length > 0 && item.comments.map(comment => (
                        <Item {...this.props} key={comment.id} item={comment} />
                    ))}
                </Grid>
            </Grid>
        )
    }
}

class GameComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    componentDidMount() {
        const { firebase, post } = this.props;
        const firestore = firebase.app.firestore();
        firestore.collection('game').doc(post).collection('comment').get().then(docs => {
            if (this.isUnmounted) {
                return;
            }

            this.setState({
                size: docs.size
            })
        });

        this.loadItem();
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    loadItem = () => {
        const { firebase, post } = this.props;
        var { num, lastVisible, list } = this.state;
        const firestore = firebase.app.firestore();
        const ref = firestore.collection('game').doc(post).collection('comment').orderBy('date');

        const rootRef = lastVisible === null ? ref.limit(num) : ref.startAfter(lastVisible).limit(num);
        return rootRef.get().then(snapshots => {
            if (this.isUnmounted) {
                return;
            }

            if (snapshots.empty) {
                this.setState({ hasMore: false });
            } else {
                lastVisible = snapshots.docs[snapshots.docs.length - 1];

                snapshots.forEach(doc => {
                    var data = doc.data();
                    var obj = Object.assign({}, doc.data());
                    obj.date = new Date(data.date.toMillis());
                    obj.id = doc.id;
                    obj.comments = [];

                    list.push(obj)
                })

                this.setState({
                    lastVisible,
                    list
                })
            }
        });
    }



    onEdit = (id) => {
        const { firebase, post } = this.props;
        var firestore = firebase.app.firestore();

        firestore.collection('game').doc(post).collection('comment').doc(id).get().then(doc => {
            if (this.isUnmounted) {
                return;
            }

            if (doc.exists) {
                this.setState({
                    value: doc.data().text,
                    visible: true,
                    edit: id
                })
            }
        })
    }

    onReply = (id) => {
        this.setState({
            reply: id,
            visible: true,
            value: '',
        })
    }

    handleSubmit = () => {
        const { authUser, firebase, post } = this.props;
        var { value, reply, edit } = this.state;
        var firestore = firebase.app.firestore();

        this.setState({
            submitting: true,
        });

        var commentRef = firestore.collection('game').doc(post).collection('comment');

        if (edit) {
            commentRef.doc(edit).update({
                text: value,
            }).then(() => {
                this.setState({
                    ...INITIAL_STATE,
                    list: []
                });
            })
        } else {
            commentRef.add({
                uid: authUser.uid,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
                date: firebase.app.firestore.FieldValue.serverTimestamp(),
                text: value,
                reply: reply ? reply : post,
            }).then(() => {
                this.setState({
                    ...INITIAL_STATE,
                    list: []
                });
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleClose = () => {
        this.setState({
            submitting: false,
            value: '',
            visible: false,
            reply: null,
            edit: null,
        });
    }



    render() {
        const { authUser, classes, post } = this.props;
        var { list, size, hasMore, submitting, value, visible } = this.state;

        var disabled = !value || value.replace(/\s/g, '').length === 0;
        var submitBtn = (
            <Button
                disabled={disabled || submitting}
                variant="contained"
                color="primary"
                className={classes.btn}
                size="large"

                onClick={this.handleSubmit}
            >
                {submitting && (
                    <CircularProgress className={classNames(classes.progress, classes.marginRight)} size={24} />
                )}
                <Typography color="textPrimary">
                    {submitting ? "Submitting" : "Submit"}
                </Typography>
            </Button>
        )

        var comments = list.map(target => {
            target.comments = list.filter(item => item.reply === target.id)
            return target
        });

        comments = comments.filter(item => item.reply === post)

        return (
            <Grid container direction="column" className={classes.root}>
                <Typography variant="h6">{size} Comments</Typography>

                <Grid container className={classes.inputDiv}>
                    <Avatar src={authUser.photoURL ? authUser.photoURL : logo} className={classes.avatar} />
                    <Grid item container direction="column" alignItems="flex-end" xs className={classes.padding}>
                        <TextField
                            label="Add a comment..."
                            multiline
                            rowsMax="4"
                            value={value}
                            onChange={this.handleChange}
                            className={classNames(classes.textField, classes.marginLeft)}
                        />

                        {submitBtn}

                    </Grid>
                </Grid>

                <InfiniteScroll
                    dataLength={list.length}
                    next={this.loadItem}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    {list.length > 0 && comments.map((item, key) => (
                        <Item
                            classes={classes}
                            key={item.id}
                            item={item}
                            authUser={authUser}
                            onReply={this.onReply}
                            onEdit={this.onEdit}
                        />
                    ))}
                </InfiniteScroll>

                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={visible}
                    onClose={this.handleClose}
                >
                    <DialogTitle id="alert-dialog-title">Reply to ...</DialogTitle>
                    <DialogContent>
                        <Grid>
                            <TextField
                                className={classNames(classes.textField, classes.marginTop)}
                                label="Comment"
                                variant="outlined"
                                multiline
                                rows="6"
                                value={value}
                                onChange={this.handleChange}
                            />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {submitBtn}
                    </DialogActions>
                </Dialog>
            </Grid >
        );
    }
}

GameComment.propTypes = {
    classes: PropTypes.object.isRequired,
};

// const condition = authUser => !!authUser;
const condition = authUser => true;

export default withAuthorization(condition)(withStyles(styles)(GameComment));