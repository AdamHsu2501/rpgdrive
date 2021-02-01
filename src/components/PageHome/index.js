import React, { Component } from 'react';
import qs from 'qs';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { Paper, CssBaseline, Button } from '@material-ui/core';

import '../../index.css';
import { withAuthorization } from '../Session';
import ListInfinite from '../List/ListInfinite.js';

const styles = theme => ({
  listItem: {
    width: '50%',
    [theme.breakpoints.up('md')]: {
      width: '25%',
    },
  },
  md: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  paper: {
    marginTop: '2%',
    padding: theme.spacing(1),
  },
  padding: {
    padding: '20%',
  },
});

class PageHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      ref: null,
      num: 40,
      list: [],
      hasMore: true,
      lastVisible: null,
    }
  }

  componentDidMount() {
    this.setQueryRef();
    window.onbeforeunload = undefined
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location } = this.props;
    if (location.search !== prevProps.location.search) {
      this.setQueryRef();
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  setQueryRef = () => {
    const { firebase, location } = this.props;
    const firestore = firebase.app.firestore();
    var search = location.search;
    var ref = firestore.collection('game').where("complete", "==", true).where("error", "==", false);

    if (search) {
      var parsed = qs.parse(search, {
        ignoreQueryPrefix: true
      });

      if (parsed.qt) {
        ref = ref.where("search", "array-contains", parsed.qt).orderBy('update', 'desc');
      } else {
        parsed.q.split(" ").forEach(item => {
          ref = ref.where(`query.${item}`, "==", true);
        });
      }
    } else {
      ref = ref.orderBy('update', 'desc');
    }

    this.setState({
      ref,
      list: [],
      hasMore: true,
      lastVisible: null,
    }, () => {
      this.loadItem();
    });
  }

  loadItem = () => {
    var { ref, num, lastVisible, list } = this.state;

    const rootRef = lastVisible === null ? ref.limit(num) : ref.startAfter(lastVisible).limit(num);
    return rootRef.get().then(snapshots => {
      if (this.isUnmounted) {
        return;
      }

      if (snapshots.empty) {

        return this.setState({ hasMore: false });
      } else {
        lastVisible = snapshots.docs[snapshots.docs.length - 1];

        snapshots.forEach(doc => {
          var obj = Object.assign({}, doc.data());
          // obj.date = doc.data().date.toMillis();

          list.push(obj);
        })

        return this.setState({
          lastVisible: lastVisible,
          list: list
        })
      }
    });
  }

  onPay = () => {
    console.log('start')
  }

  render() {
    var { authUser, classes, theme } = this.props;
    var { ref, list, hasMore } = this.state;

    return (
      <MuiThemeProvider theme={theme} >
        <CssBaseline />
        <div className="AppContent">
          <div className="pageContent">
            <Paper className={classes.paper}>
              {ref && (
                <ListInfinite loadItem={this.loadItem} hasMore={hasMore} list={list} authUser={authUser} game={true} />
              )}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider >
    )
  }
}

PageHome.propTypes = {
  classes: PropTypes.object.isRequired,
};

// const condition = authUser => !!authUser;
const condition = authUser => true;

export default withAuthorization(condition)(withStyles(styles)(PageHome));

