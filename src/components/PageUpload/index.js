import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Prompt } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import languages from 'languages';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import {
    Button, CssBaseline, Chip, Divider, Grid,
    FormControl, FormLabel, FormHelperText,
    CircularProgress, LinearProgress, MenuItem, Paper,    
    Snackbar, SnackbarContent, Typography, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stepper, Step, StepLabel, StepContent,
    ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary,
    InputAdornment,
} from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CancelIcon from '@material-ui/icons/Cancel';
import PhotoIcon from '@material-ui/icons/Photo';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import CachedIcon from '@material-ui/icons/Cached';
import ErrorIcon from '@material-ui/icons/Error';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import '../../index.css';
import rpgmA from '../../img/rpgmA.jpg';
import rpgmB from '../../img/rpgmB.jpg';
import rpgmC from '../../img/rpgmC.jpg';
import { withAuthorization } from '../Session';
import { formatBytes } from '../List/NumberFormat'
import * as ROUTES from '../../constants/routes';

const styles = theme => ({
    root: {
        width: "100%",
    },
    input: {
        display: 'flex',
        // padding: 0,
        backgroundColor:'#000',
        borderRadius: 4,
        height: 'auto',
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
        // height: 56,
    },
    chip: {
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`,
        maxWidth: '100%',
        minHeight: 32,
        '& span': {
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
        }
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        // position: 'absolute',
        // left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1500,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    //-------------------
    pageContent: {
        width: '100%',
        maxWidth: 1200,
        marginTop: '2%',
        padding: '1%',
    },
    divider: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    content: {
        width: "100%",
        padding: theme.spacing(1),
    },
    form:{
        width: '100%',
    },
    sizeX: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    label: {
        marginBottom: theme.spacing(1),
    },
    dropzone: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: '4px',
        borderRadius: '4px',
        borderColor: '#9e9e9e',
        borderStyle: 'dashed',
        // backgroundColor: '#424242',
        backgroundColor: '#000',
        color: '#bdbdbd',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border .24s ease-in-out',
    },
    dropzoneInput: {
        witdh: '100%',
        border: '1px red soild'
    },
    icon: {
        fontSize: 80,
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    title:{
        width: "100%",
        padding: theme.spacing(1),
        overflowWrap: "break-word",
    },
    p: {
        marginBottom: theme.spacing(3),
    },
    img: {
        width: '100%',
        height: 'auto',
    },
    addzone: {
        flex: 1,
        position: 'relative',
        width: 100,
        height: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: '4px',
        borderRadius: '4px',
        borderColor: '#9e9e9e',
        borderStyle: 'dashed',
        backgroundColor: '#000',
        color: '#bdbdbd',
        outline: 'none',
        cursor: 'pointer',
        transition: 'border .24s ease-in-out',
        marginRight: 4,
        marginBottom: 4,
    },
    addIcon: {
        fontSize: 60,
        pointerEvents: 'none',
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    subIcon: {
        width: '100%',
        height: '100%',
        fontSize: 24,
        opacity: 0, 
     
        '&:hover': {
            color: '#fff',
            backgroundColor: '#000',
            opacity: 0.5,
            
        },
    },
    inputMargin: {
        width: "100%",
        marginBottom: theme.spacing(4),
    },
    btn: {
        textTransform: 'none',
        margin: theme.spacing(1),
    },
    load: {
        marginRight: theme.spacing(1),
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    snackbarContent: {
        display: 'flex',
        alignItems: 'center',
    },
    snackbarIcon: {
        fontSize: 20,
        marginRight: theme.spacing(1),
    },
    all: {
        backgroundColor: 'rgba(1, 66, 96, 0.9) !important',
    },
    adult: {
        backgroundColor: 'rgba(91, 12, 39, 0.9) !important',
    },
    link: {
        textDecoration: 'none',
        color: theme.palette.secondary.main
    },
    rpgm: {
        width: 350
    },
});

const INITIAL_STATE = {
    inputed: {
        file: false,
        displayName: false,
        imgs: false,
        R: false,
        text: false,
        language: false,
    },

    error: {
        file: false,
        displayName: false,
        imgs: false,
        R: false,
        text: false,
        info: false,
        // trialPeriod: false,
        width: false,
        height: false,
        engine: false,
        language: false,
    },

    required:{
        file: null,
        displayName: "",
        imgs: [],
        R: null,
        text: "",
        width: 816,
        height: 624,
        engine: { value: 'RPG Maker MV', label: 'RPG Maker MV' },
        language: [],
    },

    optional:{
        price: "0",
        // trialPeriod: 90,
        info: "",
        developer: [],
        artist: [],
        tag: [],
    },

    max:{
        img: 102400,
        displayName: 100,
        text: 1500,
        info: 500,
    },

    help:{
        length: "characters left",
        display: "48 - 1920",
        required: "Here is required",
        displayName: "",
        text: "",
        info: "",
    },

    AllTags: [],
    usage: 0,
    unionFile: 0,
    exceptFile: 0,

    uploadProgress: false,
    progress: 0,
    step: 0,

    snackbar: false,
    snackbarHelper: "",

    expandProgress: false,
    expanded: false,
};


class PageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...INITIAL_STATE,
        }
    }

    componentDidMount() {
        const { authUser, firebase, location } = this.props;
        const firestore = firebase.app.firestore();
        const state = location.state;
        var AllTags = [];
        firestore.collection('tag').get().then(docs => {
            if (this.isUnmounted) {
                return;
            }

            if(!docs.empty){
                
                docs.forEach(doc => AllTags.push(doc.data()));
                Promise.all(AllTags).then(() => {
                    this.setState({ AllTags })
                })
            }
        })

        if(state){
            var { inputed } = this.state;

            Object.keys(inputed).forEach(key => {
                inputed[key] = true;
            })
          
            var required = {
                file: { name: state.displayName, size: state.size },
                displayName: state.displayName,
                imgs: state.image.map(img => ({
                    name: img,
                    preview: state.imgUrl[img.replace('.', '_')],
                })),
                R: state.R,
                text: state.text,
                width: state.width,
                height: state.height,
                engine: { value: state.engine, label: state.engine },
                language: state.language.map(code => ({
                    code: code,
                    value: languages.getLanguageInfo(code).name,
                    label: languages.getLanguageInfo(code).nativeName,
                })),
            };
        
            var optional = {
                price: state.price,
                // trialPeriod: state.trialPeriod,
                info: "",
                developer: this.getValue(state.developer),
                artist: this.getValue(state.artist),
                tag: this.getValue(state.tag),
            };

            this.setState({
                inputed,
                required,
                optional
            })
        }

        firestore.collection('game').where("uploader", "==", authUser.uid).get().then(docs => {
            if (this.isUnmounted) {
                return;
            }
            var usage = 0;
            if(!docs.empty){
                docs.forEach(doc => {
                    usage += doc.data().size
                });
            }
            this.setState({ usage }, () => { this.getUsage() })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.uploadProgress) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
        
        if (prevProps.location.key !== this.props.location.key) {
            const { usage, AllTags } = prevState;
    
            this.setState({ 
                ...INITIAL_STATE,
                usage,
                AllTags
            }, () => {
                this.getUsage()
            })
        }
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }

    getValue = arr => {
        return arr.map(item => ({
            value: item,
            label: item
        }))
    }

    getUsage = () => {
        const { location } = this.props;
        const { usage, required } = this.state;
        const state = location.state;
        const file = required.file;
        var unionFile, exceptFile;
        
        if(file){
            if(state){
                exceptFile = usage - state.size;
                unionFile = exceptFile + file.size 
            }else{
                exceptFile = usage;
                unionFile = usage + file.size  
            }
        }else{
            exceptFile = usage;
            unionFile = usage;
        }

        this.setState({
            exceptFile,
            unionFile
        })
    }

    handleSubmit = () => {
        const { authUser, firebase, location } = this.props;
        const { inputed, error, required, optional } = this.state;

        const firestore = firebase.app.firestore();
        const state = location.state;
           
        if(this.check(inputed, true) && this.check(error, false)){
            this.setState({ 
                uploadProgress: true,
            }, () => {
                var obj = {}, uid, task, search = [], query = {};
              
                var date = new Date();
                var displayName = required.displayName.split(" ");
                var engine = required.engine.label.split(" ");
                var developer = optional.developer.map(item => item.label);
                var artist = optional.artist.map(item => item.label);
                var tag = optional.tag.map(item => item.label);
           
                search = search.concat(displayName, engine, developer, artist, tag);

                displayName.forEach(item => {
                    query[item] = true;
                });
                engine.forEach(item => {
                    query[item] = true;
                });
                developer.forEach(item => {
                    query[item] = true;
                })
                artist.forEach(item => {
                    query[item] = true;
                })
                tag.forEach(item => {
                    query[item] = true;
                })

                required.language.forEach(item => {
                    search = search.concat([item.code, item.value, item.value.toLowerCase(), item.label])
                    query[item.code] = true;
                    query[item.value] = true;
                    query[item.value.toLowerCase()] = true;
                    query[item.label] = true;
                })

                if(required.R){
                    search.push('r18');
                    search.push('R18');
                    query.r18 = true;
                    query.R18 = true;
                }

                obj.uploader = authUser.uid;
                obj.size = required.file.size;
                obj.image = required.imgs.map(img => img.name);
                obj.R = required.R;
                obj.text = required.text;
                obj.width = required.width;
                obj.height = required.height;
                obj.engine = required.engine.label;
                obj.language = required.language.map(item => item.code);
                
                obj.price = optional.price.length === 0 ? "0" : optional.price;
                // obj.trialPeriod = optional.trialPeriod;
                obj.developer = developer;
                obj.artist = artist;
                obj.tag = tag;
                
                obj.update = date;
                obj.search = search;
                obj.query = query;
                
                if(state){
                    uid = state.uid;

                    if(required.file.path){
                        obj.error = false;
                        obj.complete = false;
                        obj.unzip = false;
                    }

                    if(required.imgs.filter(item => item.path !== undefined).length > 0){
                        obj.error = false;
                        obj.complete = false;
                        // obj.imgUrl = {};
                    }
                    
                    if(optional.info){
                        task = firestore.collection('game').doc(uid).update({
                            ...obj,
                            info: firebase.app.firestore.FieldValue.arrayUnion({
                                date: date.getTime(),
                                text: optional.info
                            })
                        });
                    }else{
                        task = firestore.collection('game').doc(uid).update(obj);
                    }
                }else{
                    obj.displayName = required.displayName;
                    obj.date = date;
                    obj.unzip = false;
                    obj.error = false;
                    obj.complete = false;
                    obj.info = {};

                    task = firestore.collection('game').add(obj).then(doc=>{
                        return firestore.collection('game').doc(doc.id).update({ uid: doc.id }).then(() => { return doc.id })
                    })
                }
                
                task.then(result => {
                    if(result){
                        uid = result
                    }
                    return Promise.all([
                        this.uploadOptions('developer', obj.developer),
                        this.uploadOptions('artist', obj.artist),
                        this.uploadOptions('tag', obj.tag)
                    ]).then(() => {
                        this.handleStep();
                    })
                }).then(() => {
                    return this.uploadImgs(uid);
                }).then(() => {
                    if(required.file.path){
                        return this.uploadData(uid)
                    }else{
                        return this.handleStep();
                    }
                }).catch(error => {
                    console.error(error)
                })
            })
        }else{
            Promise.all(
                Object.keys(inputed).filter(item => inputed[item] === false ).map(item => error[item] = true )
            ).then(() => {
                return this.setState({ error })
            }).then(() => {
                this.scrollTo(Object.keys(error).find(item => {
                    return error[item] === true; 
                }))
            })
        }
    }
    
    check = (obj, boolean) => {
        return Object.keys(obj).every(item => {
            return obj[item] === boolean
        })
    }

    scrollTo = id => {
        const domNode = ReactDOM.findDOMNode(this[id])
        domNode.scrollIntoView({block: "center", behavior: "smooth",})
    }

    uploadOptions = (key, arr) => {
        const { firebase } = this.props;
        const firestore = firebase.app.firestore();
        return Promise.all( arr.map(item => 
            firestore.collection('tag').doc(item).set({
                label: item,
                [key]: true,
            }, { merge: true }))
        );
    }

    uploadImgs = (id) => {
        const { firebase } = this.props;
        const { required } = this.state;
        const storage = firebase.app.storage();
        const imgs = required.imgs;
        return Promise.all( imgs.filter(item => item.path !== undefined).map(item => {
            return storage.ref(`game/${id}/${item.name}`).put(item)
        })).then(() => {
            this.handleStep();
        })        
    }

    uploadData = (id) => {
        const { firebase } = this.props;
        const { required } = this.state;
        const storageRef = firebase.app.storage().ref();
        const file = required.file;
        var path = `game/${id}/${file.name}`
        var uploadTask = storageRef.child(path).put(file);

        const that = this;
        return new Promise(function (resolve, reject) {
            uploadTask.on('state_changed', function (snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    that.setState({ progress });
                }, function (error) {

                }, function () {
                    resolve(that.handleStep());
                }
            );
        });
    }

    handleStep = () => {
        this.setState(state => ({
            step: state.step + 1,
        }));
    };

    handleChange = name => e => {
        const { help, max } = this.state;
        const whitespace = /^[\s].*/;
        var value = e.target.value, helper, error;
        const leftNumber = max[name] - value.length;

        if (value) {
            if (whitespace.test(value)) {
                helper = "No whitespace at the begining";
                error = true;
            }

            if (leftNumber < 0) {
                helper = leftNumber.toString().concat(" ", help.length);
                error = true;
            }

            if (leftNumber >= 0 && !whitespace.test(value)) {
                helper = leftNumber.toString().concat(" ", help.length);
                error = false;
            }
        } else {
            helper = name === 'info' ? "" : help.required;
            error = name === 'info' ? false : true;
        }

        if(name === 'info'){
            this.setState({
                optional: {...this.state.optional, [name]: value},
                help: {...this.state.help, [name]: helper},
                error: {...this.state.error, [name]: error },
           })
        }else{
            this.setState({
                required: {...this.state.required, [name]: value},
                help: {...this.state.help, [name]: helper},
                error: {...this.state.error, [name]: error },
                inputed: {...this.state.inputed, [name]: true}
           })
        }
        
    }

    handleDisplayChange = name => e => {
        const value = e.target.value ? parseInt(e.target.value) : 0;
        var error;
        if(name === 'trialPeriod'){
            
            if(value >= 0){
                error = false;
            }else{
                error = true;
            }

            this.setState({
                optional: {...this.state.optional, [name]: value},
                error: {...this.state.error, [name]: error },
            });
        }else{
            if (value && value <= 1920 && value >= 48) {
                error = false;
            } else {
                error = true;
            }
    
            this.setState({
                required: {...this.state.required, [name]: value},
                error: {...this.state.error, [name]: error },
           });
        }
        
    }

    handleToggleButton = ( e, value ) => {
        var error;
        if(value !== null){
            error = false;
        }else{
            error = true;
        }

        this.setState({
            required: {...this.state.required, R: value},
            error: {...this.state.error, R: error },
            inputed: {...this.state.inputed, R: true}
       })
    }

    handleEngine = value => {
        var error;
        
        if (value) {
            error = false;
        } else {
            error = true;
        }
        this.setState({
            required: {...this.state.required, engine: value},
            error: {...this.state.error, engine: error },
        })
    }

    handleMultiSelect = name => value => {
        if(name === 'language'){
            var error;
            if (value.length > 0) {
                error = false;
            } else {
                error = true;
            }
            this.setState({
                required: {...this.state.required, [name]: value},
                error: {...this.state.error, [name]: error },
                inputed: {...this.state.inputed, [name]: true}
           })
        }else{
            this.setState({
                optional: {...this.state.optional, [name]: value},
            })
        }
    }

    onDropFile = files => {
        const { authUser } = this.props;
        const { exceptFile } = this.state;
        var file = files[0];
        const valid = (authUser.limit - exceptFile) >= file.size ? true : false;
        if(valid){
            this.setState({ 
                required: {...this.state.required, file },
                error: {...this.state.error, file: false },
                inputed: {...this.state.inputed, file: true}
            }, () => { this.getUsage() })
        }else{
            this.setState({
                snackbar: true,
                snackbarHelper: 'Game data too big'
            })
        }
    };

    onDropImgs = arr => {
        const { max } = this.state;
        
        var imgs = arr.filter(item => item.size <= max.img).map(item => 
                Object.assign(item, {
                    preview: URL.createObjectURL(item)
                })
            );

        var invalid = arr.find(item => item.size > max.img)

        this.setState({
            required: {...this.state.required, imgs },
            error: {...this.state.error, imgs: false },
            inputed: {...this.state.inputed, imgs: true},
            snackbar: invalid ? true : false,
            snackbarHelper: invalid ? `${invalid.name} is too big` : "",
        })
    }

    onDropImg = key => file => {
        var { required, max } = this.state;
        var imgs = required.imgs;
        
        if(file[0].size > max.img){
            this.setState({
                snackbar: true,
                snackbarHelper: `${file[0].name} is too big`
            })
        }else{
            imgs[key] = Object.assign(file[0], { preview: URL.createObjectURL(file[0]) });
            this.setState({ required: {...this.state.required, imgs } })
        }
    }

    clearImg = key => e => {
        var { required } = this.state;
        var imgs = required.imgs;
        if(imgs.length - 2 === key){
            imgs.pop()
        }else{
            imgs.splice(key, 1);
        }
        
        this.setState({ required: {...this.state.required, imgs } })
    }

    filterOptions = (key) => {
        const { AllTags } = this.state;
        return AllTags.filter((item, index, array) => {
            return item[key] === true
        }).map(item => ({
            value: item.label,
            label: item.label
        }))
    }

    handleClose = () => {
        const { history } = this.props;
        this.setState({
            uploadProgress: false
        }, () => {
            history.push({
                pathname: ROUTES.ACCOUNT
            })
        })
            
        //this.setState(INITIAL_STATE)
    }

    handleSnackbar = () => {
        this.setState({ snackbar: false });
    }

    handlePanel = key => (e, value) => {
        this.setState({
            expanded: value? key : false
        })
    }
    
    render() {
        const { authUser, classes, theme, location } = this.props;
        const {
            error, required, optional, help, 
            exceptFile, unionFile,
            uploadProgress, progress, step,
            snackbar, snackbarHelper,
            expandProgress, expanded,
        } = this.state;

        const state = location.state;

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };

        var languageOptions = languages.getAllLanguageCode().map(code => ({
            code: code,
            value: languages.getLanguageInfo(code).name,
            label: languages.getLanguageInfo(code).nativeName,
        }))

        var engineOptions = [{ value: 'RPG Maker MV', label: 'RPG Maker MV' }];

        var developerOptions = this.filterOptions('developer');

        var artistOptions = this.filterOptions('artist');

        var tagOptions = this.filterOptions('tag');

        var percent = exceptFile > 0 ? exceptFile / authUser.limit * 100 : 0;
        var bufferPercent = unionFile > 0 ? unionFile / authUser.limit * 100 : percent;
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Prompt
                    key='block-nav'
                    when={uploadProgress}
                    message='Are you sure you want to leave?'
                />
                <div className="AppContent">
                    <Paper className={classes.pageContent}>
                        <Grid container direction="column" >

                            <Grid container direction="column" >
                                <Typography variant="h5">Preview storage usage</Typography>
                                <LinearProgress variant="buffer" value={percent} valueBuffer={bufferPercent} />
                                
                                <Typography>usage: {parseFloat(bufferPercent.toFixed(2))}%</Typography>
                                <Typography color="textSecondary">( {formatBytes(unionFile, 2)} / {formatBytes(authUser.limit, 2)} )</Typography>
                            </Grid>
                            <Divider className={classes.divider}/>

                            <Grid container >
                                <Grid item xs={12} sm={6}>
                                    <FormControl 
                                        component="fieldset" 
                                        required 
                                        error={error.file} 
                                        className={classes.form} 
                                        ref={ f => { this.file = f } }
                                    >
                                        <FormLabel className={classes.label}>Game file</FormLabel>
                                        <Dropzone
                                            onDrop={this.onDropFile}
                                            multiple={false}
                                            accept="application/x-rar-compressed, 
                                                    application/octet-stream, 
                                                    application/zip, 
                                                    application/x-zip-compressed, 
                                                    multipart/x-zip"
                                        >
                                            {({ getRootProps, getInputProps }) => (
                                                <section>
                                                    <div {...getRootProps({ className: classes.dropzone })}>
                                                        <input {...getInputProps()} />

                                                        <CloudUploadIcon className={classes.icon} />

                                                        {required.file && (
                                                            <Typography variant="h5" color="textPrimary" align="center" className={classes.title}>
                                                                {required.file.name} - {formatBytes(required.file.size)}
                                                            </Typography>
                                                        )}

                                                        <Typography color="textSecondary" className={classes.p}>
                                                            Click or drag ZIP file to this area
                                                        </Typography>
                                                    </div>
                                                </section>
                                            )}
                                        </Dropzone>
                                        <FormHelperText>{error.file && help.required}</FormHelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} container justify="center" alignItems="center">
                                    <Button onClick={() => this.setState({ expandProgress: true})}>
                                        How to upload game file
                                    </Button>
                                </Grid>
                            </Grid>

                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="Name"
                                className={classes.inputMargin}
                                value={required.displayName}
                                onChange={this.handleChange('displayName')}
                                margin="normal"
                                helperText={help.displayName}
                                error={error.displayName}
                                InputProps={{
                                    className: classes.input
                                }}
                                disabled={state ? true : false}
                                ref={ f => { this.displayName = f } }
                            />

                            <Grid container >
                                <Grid item container direction="column" xs={12} sm={6} className={classes.content}>
                                    <Grid className={classes.inputMargin}>
                                        <FormControl 
                                            component="fieldset"
                                            required
                                            error={error.imgs}
                                            className={classes.form}
                                            ref={ f => { this.imgs = f } }
                                        >
                                            <FormLabel className={classes.label}>Game images</FormLabel>
                                            <Dropzone
                                                onDrop={this.onDropImgs}
                                                accept="image/gif, image/jpeg, image/png"
                                            >
                                                {({ getRootProps, getInputProps }) => (
                                                    <section>
                                                        {required.imgs.length > 0 ? (
                                                            <div {...getRootProps({ className: classes.dropzone })}>
                                                                <input {...getInputProps()} />
                                                                <img 
                                                                    src={required.imgs[0].preview} 
                                                                    className={classes.img} 
                                                                    alt={required.imgs[0].name}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div {...getRootProps({ className: classes.dropzone })}>
                                                                <input {...getInputProps()} />
                                                            
                                                                <PhotoIcon className={classes.icon} />

                                                                <Typography color="textSecondary" >
                                                                    Click or drag JPEG, PNG, GIF file to this area
                                                                </Typography>
                                                                <Typography color="textSecondary" className={classes.p}>
                                                                    JPEG, PNG, GIF 100 KiB or less
                                                                </Typography>
                                                            </div>
                                                        )}
                                                    </section>
                                                )}
                                            </Dropzone>
                                            <FormHelperText>{error.imgs && help.required}</FormHelperText>
                                        </FormControl>
                                    
                                        <Grid container >
                                            {required.imgs.length > 0 && required.imgs.slice(1).map((item, key) => (
                                                <Dropzone
                                                    key={key + 1}
                                                    onDrop={this.onDropImg(key + 1)}
                                                    accept="image/gif, image/jpeg, image/png"
                                                    noClick
                                                >
                                                    {({ getRootProps, getInputProps, open }) => (
                                                        <section>
                                                            <div {...getRootProps({ className: classes.addzone })}>
                                                                <input {...getInputProps()} />
                                                                <img src={item.preview} className={classes.img} alt={item.name}/>
                                                                <Grid container className={classes.mask}>
                                                                    <Grid item container justify="center" alignContent="center" xs >
                                                                        <CachedIcon className={classes.subIcon} onClick={open}/>
                                                                    </Grid>
                                                                    <Grid item container justify="center" alignContent="center" xs >
                                                                        <ClearIcon className={classes.subIcon} onClick={this.clearImg(key + 1)}/>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>
                                                            
                                                        </section>
                                                    )}
                                                </Dropzone>
                                            ))}
                                            {required.imgs.length > 0 && required.imgs.length < 5 && (
                                                <Dropzone
                                                    key={required.imgs.length}
                                                    onDrop={this.onDropImg(required.imgs.length)}
                                                    multiple={false}
                                                    accept="image/gif, image/jpeg, image/png"
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section>
                                                            <div {...getRootProps({ className: classes.addzone })}>
                                                                <input {...getInputProps()} />
                                                            
                                                                <AddIcon className={classes.addIcon} />
                                                                <Typography color="textSecondary">
                                                                    Add
                                                                </Typography>
                                                            </div>
                                                        </section>
                                                    )}
                                                </Dropzone>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <FormControl 
                                        component="fieldset"
                                        required
                                        error={error.R}
                                        ref={ f => { this.R = f } }
                                    >
                                        <FormLabel className={classes.label}>Rating</FormLabel>
                                        <ToggleButtonGroup value={required.R} exclusive onChange={this.handleToggleButton}>
                                            <ToggleButton value={false} classes={{ selected: classes.all }}>
                                                To all age
                                            </ToggleButton>
                                            <ToggleButton value={true} classes={{ selected: classes.adult }}>
                                                To adult
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        <FormHelperText>{error.R && help.required}</FormHelperText>
                                    </FormControl>

                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label="Introduction"
                                        className={classes.inputMargin}
                                        value={required.text}
                                        onChange={this.handleChange('text')}
                                        margin="normal"
                                        helperText={help.text}
                                        error={error.text}
                                        multiline
                                        rows="20"
                                        rowsMax="25"
                                        InputProps={{
                                            className: classes.input
                                        }}
                                        ref={ f => { this.text = f } }
                                    />

                                    {authUser.paypal && (
                                        <NumberFormat
                                            customInput={TextField}
                                            autoComplete="off"
                                            variant="outlined"
                                            label="Price"
                                            className={classes.inputMargin}
                                            value={optional.price}
                                            margin="normal"
                                            helperText="set 0 provides free play for users and accepts donations from users"
                                            thousandSeparator={true}
                                            allowNegative={false}
                                            allowEmptyFormatting={false}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            onValueChange={(values) => {
                                                const { value } = values;
                                                this.setState({
                                                    optional: {...this.state.optional, price: value}
                                                })
                                            }}
                                            InputProps={{
                                                className: classes.input,
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    )}

                                    {/* {parseFloat(optional.price) > 0 && (
                                        <TextField
                                            variant="outlined"
                                            label="Trial period"
                                            value={optional.trialPeriod.toString()}
                                            helperText="Users can play for free during this time"
                                            error={error.trialPeriod}
                                            onChange={this.handleDisplayChange('trialPeriod')}
                                            margin="normal"
                                            type="number"
                                            InputProps={{
                                                className: classes.input,
                                                endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                                                inputProps: { min: "0" }
                                            }}
                                            ref={ f => { this.trialPeriod = f } }
                                        />
                                    )} */}

                                    {state && (
                                    <TextField
                                       variant="outlined"
                                       fullWidth
                                       label="Update information"
                                       className={classes.inputMargin}
                                       value={optional.info}
                                       onChange={this.handleChange('info')}
                                       margin="normal"
                                       helperText={help.info}
                                       error={error.info}
                                       multiline
                                       rows="10"
                                       rowsMax="25"
                                       InputProps={{
                                           className: classes.input
                                       }}
                                       ref={ f => { this.info = f } }
                                    /> 
                                    )}
                                </Grid>

                                <Grid item container direction="column" xs={12} sm={6} className={classes.content}>

                                    <Grid container justify="space-around" className={classes.inputMargin}>
                                        <Grid item xs={12}>
                                            <Typography color="textSecondary">Game display size</Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                className={classes.form}
                                                variant="outlined"
                                                label="Width"
                                                value={required.width.toString()}
                                                helperText={error.width && help.display}
                                                error={error.width}
                                                onChange={this.handleDisplayChange('width')}
                                                margin="dense"
                                                type="number"
                                                
                                                InputProps={{
                                                    className: classes.input,
                                                    inputProps: {
                                                        min: "48", 
                                                        max: "1920",
                                                    }
                                                }}
                                                
                                                ref={ f => { this.width = f } }
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField
                                                className={classes.form}
                                                variant="outlined"
                                                label="Heigth"
                                                value={required.height.toString()}
                                                helperText={error.height && help.display}
                                                error={error.height}
                                                onChange={this.handleDisplayChange('height')}
                                                margin="dense"
                                                type="number"
                                                InputProps={{
                                                    className: classes.input,
                                                    inputProps: {
                                                        min: "48", 
                                                        max: "1920",
                                                    }
                                                }}
                                                ref={ f => { this.height = f } }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography color="textSecondary">The recommended size is 816 x 624, 624 x 816, 768 x 432</Typography>
                                        </Grid>
                                    </Grid>
                                    
                                    <Select
                                        classes={classes}
                                        styles={selectStyles}
                                        components={components}
                                        textFieldProps={{
                                            label: 'Engine of game',
                                            InputLabelProps: {
                                                shrink: true,
                                            },
                                            required: true,
                                            helperText: error.engine && help.required,
                                            error: error.engine,
                                        }}
                                        options={engineOptions}
                                        // placeholder="Select"
                                        value={required.engine}
                                        onChange={this.handleEngine}
                                        isClearable
                                        className={classes.inputMargin}
                                        ref={ f => { this.engine = f } }
                                    />
                                 
                                    <Select
                                        classes={classes}
                                        styles={selectStyles}
                                        components={components}
                                        textFieldProps={{
                                            label: 'Language of game',
                                            InputLabelProps: {
                                                shrink: true,
                                            },
                                            required: true,
                                            helperText: error.language && help.required,
                                            error: error.language,
                                        }}
                                        options={languageOptions}
                                        // placeholder="multiple"
                                        value={required.language}
                                        onChange={this.handleMultiSelect('language')}
                                        isMulti
                                        className={classes.inputMargin}
                                        ref={ f => { this.language = f } }
                                    />
                                    
                                    <CreatableSelect
                                        classes={classes}
                                        styles={selectStyles}
                                        textFieldProps={{
                                            label: 'Developer / Publisher',
                                            InputLabelProps: {
                                                shrink: true,
                                            },
                                            // helperText: 'multiple',
                                        }}
                                        options={developerOptions}
                                        components={components}
                                        value={optional.developer}
                                        onChange={this.handleMultiSelect('developer')}
                                        // placeholder="Multiple Select or Input"
                                        isMulti
                                        className={classes.inputMargin}
                                    />
                                    
                                    <CreatableSelect
                                        classes={classes}
                                        styles={selectStyles}
                                        textFieldProps={{
                                            label: 'Artist',
                                            InputLabelProps: {
                                                shrink: true,
                                            },
                                            // helperText: 'multiple',
                                        }}
                                        options={artistOptions}
                                        components={components}
                                        value={optional.artist}
                                        onChange={this.handleMultiSelect('artist')}
                                        // placeholder="Multiple Select or Input"
                                        isMulti
                                        className={classes.inputMargin}
                                    />
                               
                                    <CreatableSelect
                                        classes={classes}
                                        styles={selectStyles}
                                        textFieldProps={{
                                            label: 'Tags / Hashtag',
                                            InputLabelProps: {
                                                shrink: true,
                                            },
                                            // helperText: 'multiple',
                                        }}
                                        options={tagOptions}
                                        components={components}
                                        value={optional.tag}
                                        onChange={this.handleMultiSelect('tag')}
                                        // placeholder="Multiple Select or Input"
                                        isMulti
                                        className={classes.inputMargin}
                                    
                                    />
                                
                                </Grid>
                            </Grid>
                            <Grid container justify="flex-end">
                                <Button variant="contained" color="primary" onClick={this.handleSubmit}>
                                    <Typography color="textPrimary">Submit</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>


                <Dialog
                    fullWidth
                    maxWidth='sm'
                    open={uploadProgress}
                >
                    <DialogTitle id="alert-dialog-title">Upload progress</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={step} orientation="vertical">
                        
                            <Step key={0}>
                                <StepLabel>Upload game infomation</StepLabel>
                                <StepContent>
                                    <Grid container alignItems="center">
                                        <CircularProgress size={24} className={classes.load}/>
                                        <Typography>Uploading...</Typography>
                                    </Grid>
                                </StepContent>
                            </Step>
                            <Step key={1}>
                                <StepLabel>Upload game images</StepLabel>
                                <StepContent>
                                    <Grid container alignItems="center">
                                        <CircularProgress size={24} className={classes.load}/>
                                        <Typography>Uploading...</Typography>
                                    </Grid>
                                </StepContent>
                            </Step>
                            <Step key={2}>
                                <StepLabel>Upload game data</StepLabel>
                                <StepContent>
                                    <Grid container justify="space-between" alignItems="center">
                                        <Grid item xs={10}><LinearProgress variant="determinate" value={progress}/></Grid>
                                        <Grid item xs={1}><Typography>{Math.round(progress)}%</Typography></Grid>
                                    </Grid>
                                </StepContent>
                            </Step>
                        </Stepper>
                    </DialogContent>
                    <DialogActions>
                        {step === 3 && (
                            <Button variant="contained" color="primary" onClick={this.handleClose} className={classes.btn}>
                                <Typography color="textPrimary">Done</Typography>
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth='lg'
                    open={expandProgress}
                    onClose={() => this.setState({ expandProgress: false})}
                >
                    <DialogTitle id="alert-dialog-title">Upload Info</DialogTitle>
                    <DialogContent>
                    <ExpansionPanel expanded={expanded === 0} onChange={this.handlePanel(0)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>RPG Maker MV</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Use
                                <a className={classes.link} href="http://www.rpgmakerweb.com/products/programs/rpg-maker-mv" target="_blank" rel="noopener noreferrer" >『RPG Maker MV』</a>
                                for game production.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel expanded={expanded === 1} onChange={this.handlePanel(1)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>File names</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column">
                                <Typography>
                                    Please name the file in English. Do not use other languages. "圖片.png" and "イメージ.png" will fail to load.
                                </Typography>
                                <Typography>
                                    Please check file names with Case sensitive. "image.png" and "Image.png" are recognized as different files.
                                </Typography>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel expanded={expanded === 2} onChange={this.handlePanel(2)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>Audio</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column">
                            <Typography>
                                The audio file must have both <span className={classes.link}>m4a</span> format and <span className={classes.link}>ogg</span> format, even with the same content.
                            </Typography>
                            <Typography>
                                <span className={classes.link}>m4a</span> is for smartphone.
                            </Typography>
                            <Typography>
                                <span className={classes.link}>ogg</span> is for computer.
                            </Typography>
                            </Grid>
                            
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel expanded={expanded === 3} onChange={this.handlePanel(3)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                            <Typography>How to upload game file</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction="column">
                            <Typography>1. Deployment of published works in "web browser" format (output)</Typography>
                            <img className={classes.rpgm} src={rpgmA} alt="0" />
                            <img className={classes.rpgm} src={rpgmB} alt="1" />

                            <Typography>2. Compress the "www" folder into a zip format, then upload "www.zip" file</Typography>
                            <img className={classes.rpgm} src={rpgmC} alt="2" />
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    </DialogContent>
                </Dialog>

                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={snackbar}
                    onClose={this.handleSnackbar}
                >
                    <SnackbarContent
                        className={classes.error}
                        message={
                            <Typography color="textPrimary" className={classes.snackbarContent}>
                                <ErrorIcon className={classes.snackbarIcon}/>{snackbarHelper}
                            </Typography>
                        }
                    />
                </Snackbar>
            </MuiThemeProvider>
        )
    }
}


const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};
function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}
function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}
function Control(props) {
    return (
        <TextField
            fullWidth
            variant="outlined"
            // margin="normal"
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}

            {...props.selectProps.textFieldProps}
        />
    );
}
function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}
function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}
function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}
function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}
function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}
function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}


PageUpload.propTypes = {
    classes: PropTypes.object.isRequired,
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withStyles(styles)(PageUpload));