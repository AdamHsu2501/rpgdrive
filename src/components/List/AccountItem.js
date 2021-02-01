import React, { Component } from 'react';
import '../../index.css';
import { Link } from 'react-router-dom';
import languages from 'languages';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Badge, Button, Chip, Typography, Paper, Grid, CircularProgress } from '@material-ui/core';

import { withFirebase } from '../Firebase';
import { numberWithCommas } from './NumberFormat';
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    root: {
        width: "100%",
        overflow: "hidden",
        marginBottom: theme.spacing(1),
    },
    paper: {
        width: '100%',
        padding: theme.spacing(1)
    },
    content: {
        position: 'relative',
    },
    img: {
        display: 'block',
        width: '100%',
    },
    link: {
        textDecoration: 'none',
        width: "100%"
    },
    title: {
        overflowWrap: "break-word"
    },
    chipContent: {
        // width: "100%",
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
    margin: {
        margin: theme.spacing(0.5),
    },
    padding: {
        padding: theme.spacing(1),
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'black',
        opacity: 0.8,
        zIndex: 1501,
    },

});

class AccountItem extends Component {
    state = {
        activeStep: 0,
        play: 0,
        comment: 0,
    };

    componentDidMount() {
        const { item } = this.props;
        this.getNumber(item.uid, 'play')
        this.getNumber(item.uid, 'comment')
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    handleStepChange = activeStep => {
        this.setState({ activeStep });
    };


    toDate = (date) => {
        var d = new Date(date.toMillis());
        return d.toLocaleDateString()
    }

    getNumber = (id, col) => {
        const { firebase } = this.props;
        var firestore = firebase.app.firestore();
        var ref = firestore.collection('game').doc(id);
        ref.collection(col).get().then(docs => {
            if (this.isUnmounted) {
                return;
            }
            var size = numberWithCommas(docs.size)
            this.setState({ [col]: size });
        })
    }

    render() {
        var { classes, item, authUser, isSelf, onDelete, onActivity } = this.props;
        const { play, comment } = this.state;

        const tags = [];
        if (item.language) {
            item.language.forEach(val => {
                tags.push(languages.getLanguageInfo(val).nativeName);
            })
        }

        if (item.tag) {
            const len = item.tag.length > 10 ? 10 : item.tag.length;
            for (var i = 0; i < len; i++) {
                tags.push(item.tag[i])
            }
        }

        var invisible = true;
        if (authUser && authUser.notice) {
            if (authUser.notice[item.uid]) {
                invisible = false;
            }
        }


        return (
            <Badge color="secondary" variant="dot" invisible={invisible} className={classes.root}>
                {!item.complete && (
                    <Grid container justify="center" alignItems="center" className={classes.mask}>
                        <CircularProgress />
                    </Grid>
                )}

                <Paper className={classes.paper} ref={f => this.all = f}>
                    <Grid container spacing={2} className={classes.content} ref={f => this.half = f}>
                        {item.error && item.complete && (
                            <Grid container justify="center" alignItems="center" className={classes.mask}>
                                <Typography>Upload error</Typography>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={3}>
                            <Link to={{ pathname: ROUTES.GAME, search: `?id=${item.uid}`, state: item }}>
                                {item.complete && (
                                    <img
                                        className={classes.img}
                                        src={item.imgUrl[item.image[0].replace('.', '_')]}
                                        alt={item.image[0]}
                                    />
                                )}
                            </Link>
                        </Grid>

                        <Grid item xs={12} sm={9} container direction="column">

                            <Link to={{ pathname: ROUTES.GAME, search: `?id=${item.uid}`, state: item }} className={classes.link}>
                                <Typography variant="h5" color="textPrimary" className={classes.title}>{item.displayName}</Typography>
                            </Link>

                            <Typography color="textSecondary">{this.toDate(item.date)}</Typography>

                            <Grid container className={classes.chipContent}>
                                {item.R && (
                                    <Chip
                                        label='R18'
                                        component="a"
                                        className={classes.chip}
                                        href={`/?qt=r18`}
                                        variant="outlined"
                                        color="secondary"
                                        clickable
                                    />
                                )}

                                {tags.map((item, key) => (
                                    <Chip
                                        key={`tag${key}`}
                                        label={item}
                                        className={classes.chip}
                                        component="a"
                                        href={`/?qt=${item}`}
                                        variant="outlined"
                                        color="primary"
                                        clickable
                                    />
                                ))}
                            </Grid>

                            <Grid container direction="column" alignContent="flex-end" alignItems="flex-end">
                                <Typography className={classes.margin}>
                                    {parseFloat(item.price) > 0 ? '$' + item.price : 'FREE'}
                                </Typography>
                                <Typography className={classes.margin}>{play} Plays</Typography>
                                <Typography className={classes.margin}>{comment} Comments</Typography>
                            </Grid>

                        </Grid>


                    </Grid>
                    {isSelf && (
                        <Grid container justify="space-between" className={classes.padding}>
                            <Button variant="outlined" color="secondary" onClick={() => onDelete(item.uid)}>
                                Delete
                            </Button>

                            <Button variant="outlined" onClick={() => onActivity(item.uid)}>
                                Activities
                            </Button>

                            <Button variant="contained" color="primary" component={Link} to={{ pathname: ROUTES.UPLOAD, state: item }} >
                                <Typography color="textPrimary">Update</Typography>
                            </Button>
                        </Grid>
                    )}
                </Paper>
            </Badge>
        );
    }
}

AccountItem.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withFirebase(withStyles(styles, { withTheme: true })(AccountItem));

