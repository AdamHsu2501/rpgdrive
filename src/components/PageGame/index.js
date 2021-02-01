import React, { Component } from 'react';
import qs from 'qs';
import languages from 'languages';
import { Link, Prompt } from 'react-router-dom';
import Fullscreen from "react-full-screen";
import ReactNipple from 'react-nipple';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import {
    Avatar, Chip, Grid, Button, Typography, CssBaseline, CircularProgress,
    Divider, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, InputAdornment,
} from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CreateIcon from '@material-ui/icons/Create';
import CodeIcon from '@material-ui/icons/Code';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import AddIcon from '@material-ui/icons/Add';
import { FaPaypal } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../../index.css';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session';
import GameComment from './comment.js';
import { numberWithCommas, formatNumber } from '../List/NumberFormat';
import logo from '../../logoFooter.svg';

const styles = theme => ({
    core: {
        background: 'black',
        position: 'relative'
    },
    header: {
        maxWidth: 1200,
        width: '100%',
        height: '52px',
        padding: theme.spacing(1),
    },
    content: {
        width: '100%',

    },
    gamepadSm: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    gamepad: {
        position: 'absolute',
        width: 150,
        height: 150,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    left: {
        left: '2%',
    },
    right: {
        right: '2%',
    },
    gamepadBtnDiv: {
        width: 150,
        height: 150,
        position: 'relative',
    },
    gamepadBtn: {
        position: 'absolute',
        fontSize: '60px',
        color: fade(theme.palette.common.white, 0.5),
        '&:hover': {
            color: theme.palette.common.white,
        },
    },
    enterBtn: {
        top: 0,
        right: 0,

    },
    escBtn: {
        bottom: 0,
        left: 0,
    },
    iconBtn: {
        fontSize: '40px',
        cursor: 'pointer',
        color: fade(theme.palette.common.white, 0.5),
        '&:hover': {
            color: theme.palette.common.white,
        }
    },
    root: {
        width: "100%",
        // overflow: 'hidden',
        padding: theme.spacing(1),
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    btn: {
        hieght: 40,
        margin: theme.spacing(1),
        color: theme.palette.common.white,
        // textTransform: 'none'
    },
    margin: {
        margin: theme.spacing(0.5),
    },
    p: {
        width: "100%",
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap',
        marginBottom: theme.spacing(5),
    },
    avatar: {
        marginRight: theme.spacing(1),
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
    link: {
        textDecoration: 'none',
        fontSize: 20,
        color: theme.palette.common.white,
    },
    slider: {
        width: '100%',
        height: 150,
        paddingRight: 30,
        paddingLeft: 30,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    sliderDiv: {
        height: 150,
        marginRight: theme.spacing(1),
    },
    img: {
        height: '100%',
        width: 'auto',
    },
    pay: {
        margin: theme.spacing(2),
    },
    span: {
        color: theme.palette.secondary.main
    },
    zoomIn: {
        width: '100%',
        height: 'auto'
    },
    timer: {
        position: "absolute",
        top: "10%",
        left: 0,
        width: 150,
        padding: theme.spacing(1),
        background: "#000",
    },
    load: {
        marginRight: theme.spacing(1),
        color: theme.palette.common.white
    },
});

const INITIAL_STATE = {
    game: null,
    save: null,

    numbers: {
        play: 0,
        like: 0,
        subscribe: 0,
    },

    isSelf: false,
    uploader: null,
    like: false,
    subscribe: false,

    gamepad: false,
    oldKeyCode: null,
    isFull: false,
    isTouched: false,

    payProgress: false,
    price: '3',
    connecting: false,

    zoomIn: false,
    image: "",

    token: null,

    license: true,

    startTime: null,
    transaction: null,
    totalMs: 0,

    countdown: 10,
};

class PageGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        this.getGameData();
        window.addEventListener("resize", this.resize);
        window.addEventListener("message", this.receivedMessage);
    }

    componentDidUpdate(prevProps) {
        // const { countdown, license, payProgress } = this.state;
        const { isTouched, payProgress } = this.state;
        if (isTouched && !payProgress) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }

        // if (countdown === 0 && !license && !payProgress) {
        //     this.setState({
        //         isFull: false
        //     }, () => {
        //         this.handlePayment();
        //     })
        // }

        if (prevProps.location.key !== this.props.location.key) {
            this.setState({ ...INITIAL_STATE }, () => {
                this.getGameData();
            });
        }
    }

    componentWillUnmount() {
        // clearInterval(this.timer)
        const { firebase, authUser } = this.props;
        const { game, isSelf, isTouched, license, startTime, transaction, totalMs } = this.state;
        const firestore = firebase.app.firestore();
        var d = Date.now()
        if (transaction) {
            firestore.collection('transaction').doc(transaction).set({
                totalMs: totalMs + Math.abs(d - startTime)
            }, { merge: true })
        }

        if (!isSelf && license && isTouched) {
            firestore.collection('game').doc(game.uid).collection('play').add({
                date: firebase.app.firestore.FieldValue.serverTimestamp(),
                player: authUser.uid,
                total: Math.abs(d - startTime),
            })
        }

        window.removeEventListener("resize", this.resize);
        window.removeEventListener("message", this.receivedMessage);

        this.isUnmounted = true;
    }

    resize = () => {
        const { game, isFull } = this.state;
        if (game) {
            var gWidth = game.width;
            var gHeight = game.height;
            const wWidth = window.innerWidth;
            const wHeight = window.innerHeight;


            if (isFull) {
                this.ifr.width = wWidth;
                this.ifr.height = wHeight;
            } else {

                if (wHeight < gHeight || wWidth < gWidth) {
                    const ratio = Math.min(wWidth / gWidth, wHeight / gHeight);
                    gHeight *= ratio;
                    gWidth *= ratio;
                }

                this.ifr.width = gWidth;
                this.ifr.height = gHeight;
            }
        }
    }

    onload = () => {
        const { game, save } = this.state;

        this.sendMessage({
            url: `https://us-central1-rpggamecenter.cloudfunctions.net/gameCore/${game.url}`,
            save
        });

        this.setState({
            startTime: Date.now(),
        })

    }

    getGameData = async () => {
        const { authUser, firebase } = this.props;
        const firestore = firebase.app.firestore();

        const parsed = qs.parse(this.props.location.search, {
            ignoreQueryPrefix: true
        });
        const id = parsed.id;

        const ref = firestore.collection('game').doc(id);

        var game = {}, numbers = {}, save, isSelf, uploader = {}, like = false, subscribe = false;
        //get game data
        ref.get().then(doc => {
            if (this.isUnmounted) {
                return;
            }
        
            if (!doc.exists) {
                this.props.history.push('/error'); //change to page 404
                throw Error;
            }

            var data = doc.data();
            game = Object.assign({}, data);
            game.date = data.date.toMillis();
            game.update = data.update.toMillis();

            var promises = [];

            //get game save file
            promises.push(
                ref.collection('save').doc(authUser.uid).get().then(doc => {
                    if (this.isUnmounted) {
                        return;
                    }
                    save = doc.data() ? doc.data() : null;
                })
            );

            //get game play numbers
            promises.push(
                ref.collection('play').get().then(docs => {
                    if (this.isUnmounted) {
                        return;
                    }
                
                    numbers.play = docs.size;
                })
            );

            if (data.uploader === authUser.uid) {
                isSelf = true;
                uploader = authUser;
            } else {
                isSelf = false;

                //get uploader
                promises.push(
                    firestore.collection("user").doc(data.uploader).get().then(useDoc => {
                        if (this.isUnmounted) {
                            return;
                        }
                    
                        uploader = Object.assign({}, useDoc.data());
                    })
                );

                //get uploader subscribes
                promises.push(
                    firestore.collectionGroup('subscribe').where("uid", "==", data.uploader).get().then(docs => {
                        if (this.isUnmounted) {
                            return;
                        }
                    
                        numbers.subscribe = docs.size
                        if (!docs.empty) {
                            docs.forEach(doc => {
                                subscribe = doc.data().from === authUser.uid ? true : false;
                            })
                        }
                    })
                );

                //get game likes
                promises.push(
                    firestore.collectionGroup('history').where("uid", "==", id).where("like", "==", true).get().then(docs => {
                        if (this.isUnmounted) {
                            return;
                        }
                    
                        numbers.like = docs.size;
                        if (!docs.empty) {
                            docs.forEach(doc => {
                                like = doc.data().from === authUser.uid ? true : false;
                            })
                        }
                    })
                );
            }

            return Promise.all(promises)
        }).then(() => {
            if (!isSelf && uploader.paypal && parseFloat(game.price) > 0) {
                firestore.collection('transaction')
                    .where("game", "==", game.uid)
                    .where("payer", "==", authUser.uid)
                    .where("action", "==", "buy")
                    // .where("status", "==", "COMPLETED")
                    .orderBy("date", "desc")
                    .limit(1)
                    .get().then(docs => {
                        if (this.isUnmounted) {
                            return;
                        }
                    
                        if (docs.empty) {
                            this.setGameData(game, numbers, save, isSelf, uploader, like, subscribe, false, null, 0)
                        } else {
                            docs.forEach(doc => {
                                var transaction = doc.data().payKey;
                                var totalMs = doc.data().totalMs ? doc.data().totalMs : 0;
                                this.setGameData(game, numbers, save, isSelf, uploader, like, subscribe, true, transaction, totalMs)
                            })

                        }
                    })
            } else {
                this.setGameData(game, numbers, save, isSelf, uploader, like, subscribe, true, null, 0)
            }
        })
    }

    setGameData = (game, numbers, save, isSelf, uploader, like, subscribe, license, transaction, totalMs) => {
        const countdown = game.trialPeriod;
        // const millisecond = countdown * 1000;
        this.setState({
            game,
            numbers,
            save,
            isSelf,
            uploader,
            like,
            subscribe,
            license,
            countdown,
            // time: license ? null : Date.now() + millisecond,
            transaction,
            totalMs
        }, () => {
            this.resize();
            console.log(this.state)
            if (!license) {
                // this.timer = setInterval(() => this.tick(), 1000);
                this.handlePayment();
            }

            if (!isSelf) {
                this.handleHistory()
            }

        })
    }


    // tick = () => {
    //     const { time } = this.state;
    //     var now = Date.now()
    //     var countdown = Math.floor((time - now) / 1000)

    //     if (countdown >= 0) {
    //         this.setState({ countdown });
    //     } else {
    //         clearInterval(this.timer)
    //     }
    // }

    handleHistory = () => {
        const { authUser, firebase } = this.props;
        const { game } = this.state;
        var firestore = firebase.app.firestore();

        var historyRef = firestore.collection('user').doc(authUser.uid).collection('history').doc(game.uid);

        historyRef.get().then(doc => {
            if (this.isUnmounted) {
                return;
            }
        
            if (doc.exists) {
                historyRef.set({
                    avatar: game.imgUrl[game.image[0].replace('.', '_')],
                    date: firebase.app.firestore.FieldValue.serverTimestamp(),
                    displayName: game.displayName,
                    from: authUser.uid,
                    uid: game.uid,
                }, { merge: true })
            } else {
                historyRef.set({
                    avatar: game.imgUrl[game.image[0].replace('.', '_')],
                    date: firebase.app.firestore.FieldValue.serverTimestamp(),
                    displayName: game.displayName,
                    from: authUser.uid,
                    uid: game.uid,
                    like: false,
                    buy: false
                }, { merge: true })
            }
        })

        this.setState({
            isTouched: true
        })
    }

    updateLike = () => {
        const { firebase, authUser } = this.props;
        const { game, like, numbers } = this.state;
        const firestore = firebase.app.firestore();
        var ref = firestore.collection('user').doc(authUser.uid).collection('history').doc(game.uid);
        ref.set({
            like: !like
        }, { merge: true }).then(() => {
            numbers.like = like ? numbers.like - 1 : numbers.like + 1;
            this.setState({
                like: !like,
                numbers
            })
        })
    }

    updateSubscribe = () => {
        const { firebase, authUser } = this.props;
        const { uploader, subscribe, numbers } = this.state;
        const firestore = firebase.app.firestore();
        var ref = firestore.collection('user').doc(authUser.uid).collection('subscribe').doc(uploader.uid);

        var action = subscribe ? ref.delete() : ref.set({
            avatar: uploader.avatar ? uploader.avatar : null,
            date: firebase.app.firestore.FieldValue.serverTimestamp(),
            displayName: uploader.displayName,
            from: authUser.uid,
            uid: uploader.uid,
        }, { merge: true });

        action.then(() => {
            numbers.subscribe = subscribe ? numbers.subscribe - 1 : numbers.subscribe + 1;
            this.setState({
                subscribe: !subscribe,
                numbers
            })
        })
    }

    handleSaveFile = (data) => {
        const { firebase, authUser } = this.props;
        var { game, like, license } = this.state;
        var firestore = firebase.app.firestore();

        if (license) {
            var key;

            if (authUser.level === 3) {
                key = data.save === 'RPG Global' ? 'RPG Global' : 'RPG File1';
            } else {
                key = data.save;
            }

            // update game savefile
            firestore.collection('game').doc(game.uid).collection('save').doc(authUser.uid).set({
                [key]: data.value
            }, { merge: true });

            if (!like) {
                // subscribe game
                this.updateLike();
            }
        }
    }

    sendMessage = (obj) => {
        if (this.ifr) {
            this.ifr.focus();
            this.ifr.contentWindow.postMessage(obj, "*");
        }
    }

    receivedMessage = (e) => {
        var data = e.data;

        if (data.save) {
            this.handleSaveFile(data);
        }
    }


    handleButtonDown = (key) => {
        var obj = {
            act: "keydown",
            keyCode: key
        };
        this.sendMessage(obj);
    }

    handleButtonUp = (key) => {
        var obj = {
            act: "keyup",
            keyCode: key
        };
        this.sendMessage(obj);
    }

    handleMove = (evt, data) => {
        const { oldKeyCode } = this.state;

        if (evt.type === 'move' && data.direction) {
            var angle = data.direction.angle, keyCode;

            if (angle === 'left') { keyCode = 37; }
            if (angle === 'up') { keyCode = 38; }
            if (angle === 'right') { keyCode = 39; }
            if (angle === 'down') { keyCode = 40; }

            if (oldKeyCode !== keyCode) {
                this.handleButtonUp(oldKeyCode)
                this.handleButtonDown(keyCode)
                this.setState({ oldKeyCode: keyCode });
            }
        }

        if (evt.type === 'end') {
            this.handleButtonUp(oldKeyCode);
            this.setState({ oldKeyCode: null });
        }
    }

    handleGamepad = () => {
        this.setState({ gamepad: !this.state.gamepad })
    }

    goFull = () => {
        this.setState({ isFull: true });
    }

    closeVideo = () => {
        this.setState({ onVideo: false })
    }

    toDate = (date) => {
        var d = new Date(date);
        return d.toLocaleDateString()
    }

    handlePayment = () => {
        const { game, license } = this.state;

        var price = license ? '3' : game.price;

        this.setState({
            payProgress: true,
            price
        })
    }

    onPay = () => {
        this.setState({
            connecting: true
        })
    }

    handlePrice = value => e => {
        var { price } = this.state;
        var p = price.length > 0 ? parseFloat(price) + parseFloat(value) : parseFloat(value);
        this.setState({
            price: p.toString()
        })
    }

    handleImg = name => e => {
        this.setState({
            image: name,
            zoomIn: true,
        })
    }

    render() {
        const { authUser, classes, theme } = this.props;
        const {
            game,
            numbers,
            isSelf,
            uploader,
            like,
            subscribe,
            gamepad,
            isFull,
            isTouched,
            payProgress,
            price,
            connecting,
            zoomIn,
            image,
            // countdown,
            license,
        } = this.state;

        const leftPad = (
            <ReactNipple
                options={{ mode: 'static', position: { bottom: '50%', left: '50%' } }}
                style={{
                    width: 150,
                    height: 150,
                    position: 'relative'
                }}
                onEnd={this.handleMove}
                onMove={this.handleMove}
            />
        );

        const rightPad = (
            <Grid container direction="column" className={classes.gamepadBtnDiv}>
                <AddCircleOutlineIcon
                    className={classNames(classes.gamepadBtn, classes.enterBtn)}
                    onMouseDown={() => this.handleButtonDown(13)}
                    onMouseUp={() => this.handleButtonUp(13)}
                    onTouchStart={() => this.handleButtonDown(13)}
                    onTouchEnd={() => this.handleButtonUp(13)}
                />

                <RemoveCircleOutlineIcon
                    className={classNames(classes.gamepadBtn, classes.escBtn)}
                    onMouseDown={() => this.handleButtonDown(27)}
                    onMouseUp={() => this.handleButtonUp(27)}
                    onTouchStart={() => this.handleButtonDown(27)}
                    onTouchEnd={() => this.handleButtonUp(27)}
                />
            </Grid>
        );

        const settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            variableWidth: true,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };


        const dialogSetting = license ? ({
            fullWidth: true,
            open: payProgress,
            maxWidth: 'sm',
            onClose: () => this.setState({ payProgress: false }),
            disableBackdropClick: connecting
        }) : ({
            fullWidth: true,
            open: payProgress,
            maxWidth: 'sm',
            container: () => this.gameDiv,
            disableEnforceFocus: true,
            style: { position: 'absolute' },
            BackdropProps: { style: { position: 'absolute' } }
        })

        var submitEnable;
        if (license) {
            submitEnable = !connecting && price.length > 0 && parseFloat(price) > 0;
        } else {
            submitEnable = !connecting && price.length > 0 && parseFloat(price) >= parseFloat(game.price);
        }

        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Prompt
                    key='block-nav'
                    when={isTouched}
                    message='Are you sure you want to leave?'
                />

                {game && uploader && (
                    <Grid>
                        <Grid container direction="column" alignItems="center" className={classes.core}
                            ref={f => this.gameDiv = f}
                        >

                            <Grid className={classes.content}>
                                <Fullscreen
                                    enabled={isFull}
                                    onChange={isFull => this.setState({ isFull }, () => { this.resize() })}
                                >
                                    {/* {!license && (
                                    <Grid container justify="flex-end" className={classes.timer}>
                                        <Typography variant="h5" >Pay in {countdown}</Typography>
                                    </Grid>
                                )} */}

                                    <Grid container direction="row" alignItems="center" justify="center" id="gameCore">
                                        {gamepad && <Grid container item className={classNames(classes.gamepad, classes.left)}>{leftPad}</Grid>}

                                        <iframe
                                            scrolling="no"
                                            src={license ? (
                                                "https://us-central1-rpggamecenter.cloudfunctions.net/gameCore/player.html"
                                            ) : ""}
                                            frameBorder="0"
                                            title="game"
                                            name="gameFrame"
                                            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-orientation-lock"
                                            allow="accelerometer; ambient-light-sensor; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; magnetometer; microphone; midi; speaker; vr"
                                            allowFullScreen
                                            ref={(f) => this.ifr = f}
                                            onLoad={license ? (
                                                this.onload
                                            ) : () => { }}

                                        />

                                        {gamepad && <Grid container item className={classNames(classes.gamepad, classes.right)}>{rightPad}</Grid>}
                                    </Grid>

                                </Fullscreen>

                            </Grid>

                            <Grid container alignItems="center" justify="space-between" className={classes.header} >
                                <VideogameAssetIcon className={classes.iconBtn} onClick={this.handleGamepad} />
                                <FullScreenIcon className={classes.iconBtn} onClick={this.goFull} />
                            </Grid>

                            {gamepad && (
                                <Grid container direction="row" justify="space-between" className={classes.gamepadSm}>
                                    <Grid item >{leftPad}</Grid>
                                    <Grid item >{rightPad}</Grid>
                                </Grid>
                            )}
                        </Grid>

                        <div className="AppContent">
                            <div className="pageContent">
                                <Grid container direction="column" className={classes.root}>
                                    <Typography variant="h5" className={classes.p}>{game.displayName}</Typography>
                                    <Grid container justify="space-between" alignItems="center">
                                        <Grid>
                                            <Typography variant="h6">{numberWithCommas(numbers.play)} played</Typography>
                                        </Grid>
                                        <Grid>
                                            {!isSelf && (
                                                <Button
                                                    className={classes.btn}
                                                    onClick={this.updateLike}
                                                >

                                                    <ThumbUpAltIcon className={classes.margin} color={like ? "secondary" : "inherit"} />
                                                    <Typography color={like ? "secondary" : "inherit"} >{formatNumber(numbers.like)}</Typography>
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>

                                    {uploader.paypal && (
                                        <Grid container justify="center" className={classes.margin}>
                                            <Button variant="contained" color="secondary" className={classes.pay} onClick={this.handlePayment} >
                                                <Typography>{license ? 'Support the creator' : 'Buy now'}</Typography>
                                            </Button>
                                        </Grid>
                                    )}

                                    <Grid item xs>
                                        {game.tag.map((item, key) => (
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

                                    <Slider {...settings} className={classes.slider}>
                                        {game.image.map((item, key) => (
                                            <div
                                                key={`img${key}`}
                                                className={classes.sliderDiv}
                                                onClick={this.handleImg(game.imgUrl[item.replace('.', '_')])}
                                            >
                                                <img src={game.imgUrl[item.replace('.', '_')]} alt={item} className={classes.img} />
                                            </div>
                                        ))}
                                    </Slider>


                                    <Divider className={classes.divider} />

                                    <Grid container alignItems="flex-start">

                                        <Link to={{ pathname: ROUTES.ACCOUNT, search: `?id=${game.uploader}`, state: uploader }} className={classes.link}>
                                            <Avatar src={uploader.photoURL ? uploader.photoURL : logo} className={classes.avatar} />
                                        </Link>

                                        <Grid item container direction="column" xs >

                                            <Grid container justify="space-between">
                                                <Grid item container direction="column" xs>
                                                    <Grid>
                                                        <Link to={{ pathname: ROUTES.ACCOUNT, search: `?id=${game.uploader}`, state: uploader }} className={classes.link}>
                                                            {uploader.displayName}
                                                        </Link>
                                                    </Grid>
                                                    <Typography color="textSecondary">Published on {this.toDate(game.date)}</Typography>
                                                </Grid>

                                                {!isSelf && (
                                                    <Button
                                                        variant={subscribe ? "contained" : "outlined"}
                                                        color={subscribe ? "secondary" : "inherit"}
                                                        className={classes.btn}
                                                        onClick={this.updateSubscribe}

                                                    >
                                                        <FavoriteIcon className={classes.margin} />
                                                        <Typography>{subscribe ? 'subscribed' : 'subscribe'} {formatNumber(numbers.subscribe)}</Typography>
                                                    </Button>

                                                )}
                                            </Grid>

                                            {game.artist.length > 0 &&
                                                <Grid container alignItems="center">
                                                    <CreateIcon />
                                                    <Typography>Artist:</Typography>
                                                    {game.artist.map((item, key) =>
                                                        <Chip
                                                            key={`artist${key}`}
                                                            label={item}
                                                            className={classes.chip}
                                                            component="a"
                                                            href={`/?qt=${item}`}
                                                            variant="outlined"
                                                            color="primary"
                                                            clickable
                                                        />
                                                    )}
                                                </Grid>
                                            }

                                            {game.developer.length > 0 &&
                                                <Grid container alignItems="center">
                                                    <CodeIcon />
                                                    <Typography>Developer:</Typography>
                                                    {game.developer.map((item, key) =>
                                                        <Chip
                                                            key={`developer${key}`}
                                                            label={item}
                                                            className={classes.chip}
                                                            component="a"
                                                            href={`/?qt=${item}`}
                                                            variant="outlined"
                                                            color="primary"
                                                            clickable
                                                        />
                                                    )}
                                                </Grid>
                                            }

                                            <Grid container alignItems="center">
                                                <TextFieldsIcon />
                                                <Typography>Language:</Typography>

                                                {game.language.map(key => languages.getLanguageInfo(key).nativeName).map((item, key) => (
                                                    <Chip
                                                        key={`language${key}`}
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

                                            <Typography className={classes.p}>
                                                {game.text}
                                            </Typography >

                                            {game.info.length > 0 && (
                                                <Grid container direction="column">
                                                    {game.info.reverse().map((info, key) => (
                                                        <Grid container key={`info${key}`}>
                                                            <Grid item xs={4} sm={2}>
                                                                <Typography className={classes.p} >{this.toDate(info.date)}</Typography>
                                                            </Grid>
                                                            <Grid item xs sm>
                                                                <Typography className={classes.p} >{info.text}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <Divider className={classes.divider} />

                                    <GameComment post={game.uid} />

                                    <Dialog
                                        fullWidth
                                        maxWidth='md'
                                        onClose={() => this.setState({ zoomIn: false, image: "" })}
                                        open={zoomIn}
                                    >
                                        <img src={image} alt='zoomInImg' className={classes.zoomIn} />
                                    </Dialog>

                                    <Dialog
                                        {...dialogSetting}
                                        ref={f => this.pay = f}
                                    >
                                        <form action="https://us-central1-rpggamecenter.cloudfunctions.net/pay" method="POST" onSubmit={this.onPay}>
                                            <DialogTitle id="alert-dialog-title">
                                                {license ? 'Support' : 'Buy'} {game.displayName}
                                            </DialogTitle>
                                            <Divider />

                                            <DialogContent>
                                                <Grid container direction="column">
                                                    {license ? (
                                                        <Typography>This game is free for you but the developer accepts your support by letting you pay what you think is fair for the game.</Typography>
                                                    ) : (
                                                            <Typography>Play this game by purchasing it for <span className={classes.span}>${game.price}</span> USD or more.</Typography>
                                                        )}

                                                    <input type="hidden" name="displayName" value={game.displayName} ></input>
                                                    <input type="hidden" name="sku" value={game.uid} ></input>
                                                    <input type="hidden" name="paypal" value={uploader.paypal} ></input>
                                                    <input type="hidden" name="payeeUid" value={game.uploader} ></input>
                                                    <input type="hidden" name="payerUid" value={authUser.uid} ></input>
                                                    <input type="hidden" name="action" value={license ? "donation" : "buy"} ></input>
                                                    <input type="hidden" name="price" value={price} ></input>

                                                    <Grid container alignItems="center">
                                                        <NumberFormat
                                                            disabled={connecting}
                                                            customInput={TextField}
                                                            variant="outlined"
                                                            // name="price"
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
                                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Typography>Support the developer with an additional contribution</Typography>
                                                <Grid container >
                                                    <Button
                                                        disabled={connecting}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={this.handlePrice('1')}
                                                        className={classes.btn}
                                                    >
                                                        <AddIcon /><Typography color="textPrimary">$1</Typography>
                                                    </Button>
                                                    <Button
                                                        disabled={connecting}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={this.handlePrice('2')}
                                                        className={classes.btn}
                                                    >
                                                        <AddIcon /><Typography color="textPrimary">$2</Typography>
                                                    </Button>
                                                    <Button
                                                        disabled={connecting}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={this.handlePrice('5')}
                                                        className={classes.btn}>
                                                        <AddIcon /><Typography color="textPrimary">$5</Typography>
                                                    </Button>
                                                    <Button
                                                        disabled={connecting}
                                                        variant="contained"
                                                        color="secondary"
                                                        onClick={this.handlePrice('10')}
                                                        className={classes.btn}
                                                    >
                                                        <AddIcon /><Typography color="textPrimary">$10</Typography>
                                                    </Button>
                                                </Grid>

                                            </DialogContent>
                                            <DialogActions>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    className={classes.btn}
                                                    disabled={!submitEnable}
                                                >
                                                    {connecting ? (
                                                        <Grid container >
                                                            <CircularProgress size={24} className={classes.load} />
                                                            <Typography color="textPrimary">Connecting...</Typography>
                                                        </Grid>
                                                    ) : (
                                                            <Grid container>
                                                                <FaPaypal size={24} />
                                                                <Typography color="textPrimary">Pay with PayPal</Typography>
                                                            </Grid>
                                                        )}
                                                </Button>
                                            </DialogActions>
                                        </form>
                                    </Dialog>
                                </Grid>
                            </div>
                        </div>
                    </Grid>
                )}
            </MuiThemeProvider>
        );
    }
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <div className="arrowContent next" onClick={onClick}>
            <KeyboardArrowRightIcon style={{ fontSize: 60 }} />
        </div>
    );
}

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <div className="arrowContent prev" onClick={onClick}>
            <KeyboardArrowLeftIcon style={{ fontSize: 60 }} />
        </div>
    );
}

PageGame.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(styles)(PageGame));

