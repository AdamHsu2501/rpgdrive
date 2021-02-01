import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, Grid, CssBaseline, Tabs, Tab, Chip } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';


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
        marginTop: theme.spacing(0.5)
    }
});

const INITIAL_STATE = {
    list: [],
    size: 0,
    num: 100,
    hasMore: true,
    lastVisible: null,

    value: 'tag',
};

class PageTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        }
    }

    componentDidMount() {
        this.loadItem();
        window.onbeforeunload = undefined
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    handleChange = (event, value) => {
        this.setState({
            list: [],
            hasMore: true,
            lastVisible: null,
            value
        }, () => {
            this.loadItem();
        });
    };

    loadItem = () => {
        const { firebase } = this.props;
        var { num, lastVisible, list, value } = this.state;
        const firestore = firebase.app.firestore();
        const ref = firestore.collection('tag').where(value, '==', true).orderBy('label');

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
                    var obj = Object.assign({}, doc.data());
                    list.push(obj)
                })

                this.setState({
                    lastVisible,
                    list
                })
            }
        });
    }


    render() {
        const { classes, theme } = this.props;
        const { list, value, hasMore } = this.state;

        return (
            <MuiThemeProvider theme={theme} >
                <CssBaseline />
                <div className="AppContent">
                    <Paper className={classes.pageContent}>
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Tags" value='tag' />
                            <Tab label="Artists" value='artist' />
                            <Tab label="Developer / Publisher" value='developer' />
                        </Tabs>

                        <InfiniteScroll
                            dataLength={list.length}
                            next={this.loadItem}
                            hasMore={hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                list.length > 0 && (
                                    <p style={{ textAlign: 'center' }}>
                                        <b>Yay! You have seen it all</b>
                                    </p>
                                )
                            }
                        >
                                {list.map((item, key) => (
                                    <Grid className={classes.margin}>
                                    <Chip
                                        key={key}
                                        label={item.label}
                                        className={classes.chip}
                                        component="a"
                                        href={`/?qt=${item.label}`}
                                        variant="outlined"
                                        color="primary"
                                        clickable
                                    />
                                   </Grid>
                                ))}
                        </InfiniteScroll>
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

PageTag.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => true;

export default withAuthorization(condition)(withStyles(styles)(PageTag));

