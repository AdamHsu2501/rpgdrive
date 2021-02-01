import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    TableFooter, TablePagination, IconButton, Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, Paper, Typography,
} from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


import '../../index.css';
import { withAuthorization } from '../Session';
// import { withFirebase } from '../Firebase';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: 500,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    cell: {
        display: 'block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '100px',
        // color: '#03a9f4'
    },
});


const INITIAL_STATE = {
    refundProgress: false,
    payKey: null,
    enable: null,
    reqReason: "",
    resReason: "",
    resText: "",
    limit: 500,
    helper: "500 characters left",
    error: false,
}

class TransactionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE,
            page: 0,
            rowsPerPage: 5,
            transactions: [],
        }
    }

    componentDidMount() {
        this.getTransactions()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id || prevProps.target !== this.props.target) {
            if(this.stop){
                this.stop();
            }
            this.setState({
                transactions: []
            }, () => { this.getTransactions() })
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    getTransactions = () => {
        const { firebase, id, target } = this.props;
        const firestore = firebase.app.firestore();


        this.stop = firestore.collection('transaction').where(target, '==', id).orderBy('date', 'desc').onSnapshot(docs => {
            var transactions = [];
            if (!docs.empty) {

                docs.forEach(doc => {
                    var data = doc.data();
                    var now = Date.now(),                 
                        date = new Date(data.date.toMillis()),
                        exDate = new Date(data.exDate.toMillis()),
                        reqDate =  data.reqDate ? new Date(data.reqDate.toMillis()) : null;
              

                    var txnId = target === 'payer' ? 'payerTxnId' : 'payeeTxnId';
                    var status, enable;

                    if(data.action === 'Refund'){
                        status = 'REFUNDED';
                        enable = false;
                    }else{
                        if (data.status === 'INCOMPLETE') {
                            status = target === 'payer' && !data.reqRefund ? 'COMPLETED' : 'PROCESSING';
                            enable = now < exDate && data.reqReason.length === 0 ? true : false;
                        } else {
                            status = data.status;
                            enable = false;
                        }
                    }

                    var obj = {
                        action: data.action,
                        date,
                        enable,
                        receive: data.amount[0],
                        send: data.amount[1],
                        status: status,
                        uid: data.game,
                        displayName: data.gameName,
                        payKey: data.payKey,
                        txnId: data[txnId],
                        exDate,
                        reqDate,
                        reqReason: data.reqReason,
                        reqRefund: data.reqRefund,
                        resReason: data.resReason,
                    };

                    transactions.push(obj)
                })
            }
            this.setState({
                transactions
            })
        })
    }

    handleClose = () => {
        this.setState({
            ...INITIAL_STATE
        })
    }

    handleDetail = name => async e => {
        const { firebase, authUser } = this.props;
        const firestore = firebase.app.firestore();
        const { transactions, limit } = this.state;
        const item = transactions[name];
        var resReason = "";

        if (item.resReason === 'time') {
            await firestore.collection('game').doc(item.uid).collection('play')
                .where('player', '==', authUser.uid).where('date', '>', item.date).get().then(docs => {
                    if (this.isUnmounted) {
                        return;
                    }
                    if (!docs.empty) {
                        var total = 0;
                        docs.forEach(doc => {
                            total += doc.data().total;
                        })
                        var sec = Math.round((total / 1000) % 60);
                        var min = Math.floor((total / 1000) / 60);

                        resReason = `Play time has to less than 15 minutes. Your play time is ${min} min ${sec} sec`
                    }
                })
        }

        if (item.resReason === 'date') {
            resReason = `Request deadline: ${item.exDate.toLocaleString()}\nYour requested date: ${item.reqDate.toLocaleString()}`
        }

        this.setState({
            refundProgress: true,
            payKey: item.payKey,
            reqReason: item.reqReason,
            resReason: resReason,
            helper: `${limit - item.reqReason.length} characters left`,
            enable: item.enable,
        })
    }

    handleChange = e => {
        const { limit } = this.state;
        var value = e.target.value;
        const whitespace = /^[\s].*/;
        const length = limit - value.length;
        var helper, error;

        if (value && value.length >= 10) {
            if (whitespace.test(value)) {
                helper = "No whitespace at the begining";
                error = true;
            }

            if (length < 0) {
                helper = `${length} characters left`;
                error = true;
            }

            if (length >= 0 && !whitespace.test(value)) {
                helper = `${length} characters left`;
                error = false;
            }
        } else {
            helper = 'At least 10 characters are needed here';
            error = true;
        }

        this.setState({
            reqReason: value,
            helper,
            error,
        })
    }

    onSubmit = () => {
        const { firebase } = this.props;
        const { payKey, reqReason } = this.state;
        const firestore = firebase.app.firestore();

        firestore.collection('transaction').doc(payKey).update({
            reqRefund: true,
            reqDate: firebase.app.firestore.FieldValue.serverTimestamp(),
            reqReason,
        }).then(() => {
            this.handleClose();
        })
    }

    handleChangePage = (e, page) => {
        this.setState({ page })
    }

    handleChangeRowsPerPage = (e) => {
        this.setState({ rowsPerPage: parseInt(e.target.value, 10) })
    }
    render() {
        const { classes, target } = this.props;
        var { transactions, page, rowsPerPage,
            refundProgress, enable, reqReason, resReason, helper, error,
        } = this.state;

        const emptyRows = rowsPerPage - Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHead>
                            {target === 'payer' && (
                                <TableRow>
                                    <TableCell >Date</TableCell>
                                    <TableCell >Paypal transaction ID</TableCell>
                                    <TableCell >Game</TableCell>
                                    <TableCell align="center">Amount (USD)</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Refund</TableCell>
                                </TableRow>
                            )}

                            {target === 'payee' && (
                                <TableRow>
                                    <TableCell >Date</TableCell>
                                    <TableCell >Paypal transaction ID</TableCell>
                                    <TableCell >Game</TableCell>
                                    <TableCell align="center">Amount (USD)</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            )}

                            {target === 'game' && (
                                <TableRow>
                                    <TableCell >Date</TableCell>
                                    <TableCell >Paypal transaction ID</TableCell>
                                    <TableCell align="center">Amount (USD)</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            )}

                        </TableHead>
                        <TableBody>
                            {target === 'payer' && (
                                transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">{item.date.toLocaleString()}</TableCell>
                                        <TableCell>{item.txnId}</TableCell>
                                        <TableCell>
                                            <Link className={classes.cell} to={`/game?id=${item.uid}`}>
                                                <Typography color="primary">{item.displayName}</Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{item.receive}</TableCell>
                                        <TableCell align="center">{item.status}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color={item.enable ? 'secondary' : 'primary'}
                                                onClick={this.handleDetail(key)}
                                            >
                                                <Typography color="textPrimary">
                                                    {item.enable ? 'Request' : 'Details'}
                                                </Typography>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )))}

                            {target === 'payee' && (
                                transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">{item.date.toLocaleString()}</TableCell>
                                        <TableCell>{item.txnId}</TableCell>
                                        <TableCell>
                                            <Link className={classes.link} to={`/game?id=${item.uid}`}>{item.displayName}</Link>
                                        </TableCell>
                                        <TableCell align="right">{item.send}</TableCell>
                                        <TableCell align="right">{item.status}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleDetail(key)}
                                            >
                                                <Typography color="textPrimary">Details</Typography>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )))}

                            {target === 'game' && (
                                transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell component="th" scope="row">{item.date.toLocaleString()}</TableCell>
                                        <TableCell>{item.txnId}</TableCell>
                                        <TableCell align="right">{item.send}</TableCell>
                                        <TableCell align="right">{item.status}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleDetail(key)}
                                            >
                                                <Typography color="textPrimary">Details</Typography>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 48 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={7}
                                    count={transactions.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: { 'aria-label': 'Rows per page' },
                                        native: true,
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>


                <Dialog
                    fullWidth
                    open={refundProgress}
                    onClose={this.handleClose}
                >
                    <DialogTitle id="alert-dialog-title">Reason for refund</DialogTitle>
                    <DialogContent>
                        <TextField
                            disabled={!enable}
                            variant="outlined"
                            required
                            fullWidth
                            value={reqReason}
                            onChange={this.handleChange}
                            helperText={helper}
                            error={error}
                            multiline
                            rows="10"
                            rowsMax="15"
                            InputProps={{
                                className: classes.input
                            }}
                        />
                        {resReason.length > 0 && (
                            <TextField
                                disabled
                                margin="normal"
                                variant="outlined"
                                required
                                fullWidth
                                value={resReason}
                                multiline
                                rows="10"
                                rowsMax="10"
                                InputProps={{
                                    className: classes.input
                                }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        {target === 'payer' && enable ? (
                            <Button
                                disabled={reqReason.length === 0 || error}
                                variant="contained"
                                color="secondary"
                                onClick={this.onSubmit}
                            >
                                submit
                            </Button>
                        ) : (
                                <Button
                                    variant="contained"
                                    color='primary'
                                    onClick={this.handleClose}
                                >
                                    <Typography color="textPrimary">done</Typography>
                                </Button>
                            )}
                    </DialogActions>
                </Dialog>
            </Paper>
        )
    }
}


TransactionTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    function handleFirstPageButtonClick(event) {
        onChangePage(event, 0);
    }

    function handleBackButtonClick(event) {
        onChangePage(event, page - 1);
    }

    function handleNextButtonClick(event) {
        onChangePage(event, page + 1);
    }

    function handleLastPageButtonClick(event) {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(TransactionTable))
