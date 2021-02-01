import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { withFirebase } from '../Firebase';

import '../../index.css';
import CardItem from './CardItem';

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
    zz: {
        marginBottom: 5,
        border: '1px red soild'
    }
});

class ListInfinite extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        var { authUser, classes, loadItem, list, hasMore, game } = this.props;

        return (
            <InfiniteScroll
                dataLength={list.length}
                next={loadItem}
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
                <Grid container direction="row" >
                    {list.length > 0 && list.map((item, key) => (
                        <div className={classes.listItem} key={key}>
                            <CardItem item={item} authUser={authUser} game={game} />
                        </div>
                    ))}
                </Grid>

                {!hasMore && list.length === 0 && (
                    <Grid container justify="center" alignItems="center" className={classes.padding} >
                        <Typography variant="h5">No results found</Typography>
                    </Grid>
                )}
            </InfiniteScroll>
        );
    }
}

ListInfinite.propTypes = {
    classes: PropTypes.object.isRequired,
};

// const condition = authUser => !!authUser;
// const condition = authUser => true;

export default withFirebase(withStyles(styles)(ListInfinite));

