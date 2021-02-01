import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, CssBaseline, Tabs, Tab } from '@material-ui/core';

import '../../index.css';
import { withAuthorization } from '../Session';
import ListInfinite from '../List/ListInfinite';


const styles = theme => ({
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: '1%',
    },
    listItem: {
        width: '50%',
        [theme.breakpoints.up('md')]: {
            width: '25%',
        },
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    padding: {
        padding: '20%',
    }

});

class PageLike extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'like',
            order: 'date',
            num: 16,
            list: [],
            hasMore: true,
            lastVisible: null,
        }
    }

    componentDidMount() {
        this.loadItem();
        window.onbeforeunload = undefined
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }
      

    loadItem = () => {
        const { firebase, authUser } = this.props;
        var { value, order, num, lastVisible, list } = this.state;
        const firestore = firebase.app.firestore();
        const ref = value === 'like' || value === 'buy' ? (
            firestore.collection('user').doc(authUser.uid).collection('history').where(value, '==', true).orderBy(order, "desc")
        ):(
            firestore.collection('user').doc(authUser.uid).collection(value).orderBy(order, "desc")
        );

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
                    obj.date = doc.data().date.toMillis();

                    list.push(obj);
                })

                this.setState({
                    lastVisible: lastVisible,
                    list: list
                })
            }
        });
    }

    handleChange = (event, value) => {
        this.setState({
            value,
            list: [],
            hasMore: true,
            lastVisible: null,
        }, () => {
            this.loadItem();
        });
    };

    render() {
        const { authUser, classes, theme } = this.props;
        const { hasMore, value, list } = this.state;

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
                            <Tab label="Like" value='like' />
                            <Tab label="Subscribe" value='subscribe' />
                            <Tab label="History" value='history' />
                            <Tab label="Bought" value='buy' />
                        </Tabs>

                        <ListInfinite 
                            loadItem={this.loadItem}
                            hasMore={hasMore}
                            list={list}
                            authUser={authUser}
                            game={value === 'subscribe'? false : true }
                        />
                    </Paper>
                </div>
            </MuiThemeProvider>
        );
    }
}

PageLike.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(PageLike));

