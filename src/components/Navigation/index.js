import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Button, Toolbar, InputBase, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../../logo.svg';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        <NavigationBar authUser={authUser} />
      }
    </AuthUserContext.Consumer>
  </div>
);


const styles = theme => ({
  bar: {
    background: '#1f1f1f',
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('md')]: {
      width: '30%',
    },
  },

  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
    width: '100%',
  },

  inputInput: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(7),
    transition: theme.transitions.create('width'),
    width: '100%',
  },

  menu: {
    width: 'auto',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },

  btn: {
    height: '52px',
    color: '#fff',
    textTransform: 'none',
    '&:hover': {
      color: pink[500],
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },

  margin: {
    margin: theme.spacing(1),
  },


  md: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  sm: {
    backgroundColor: '#1f1f1f',
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  }
});

class NavigationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      value: "",
    }
  }

  handleMenuSm = () => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu
    }))
  }

  handleClear = () => {
    this.setState({
      showMenu: false,
      value: "",
    });
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  }

  hendleEnterPress = (e) => {
    const { value } = this.state;
    const { history } = this.props;
    if (e.key === 'Enter' && value !== "") {
      history.push({
        pathname: '/',
        search: `?q=${value}`,
      })
      e.preventDefault();
    }
  }

  handleRandom = () => {
    const { firebase, history } = this.props;
    var firestore = firebase.app.firestore();
    this.handleClear();
    firestore.collection('game').where("complete", "==", true).where("error", "==", false).get().then(docs => {
      if (docs.empty) {
        throw Error
      }
      var num = Math.floor(Math.random() * docs.size);

      return docs.docs[num].id
    }).then(uid=> {
      history.push({
        pathname: ROUTES.GAME,
        search: `?id=${uid}`,
      })
    }).catch(error=> {
      console.log(error)
    });
  }

  handleSignout = () => {
    const { firebase, history } = this.props
    const auth = firebase.app.auth();
    auth.signOut().then(() => {
      this.handleClear();
      history.push({
        pathname: ROUTES.SIGN_IN
      })
    });
  }

  render() {
    const { authUser, classes } = this.props
    const { showMenu, value } = this.state;

    const constItem = [
      <Button className={classes.btn} onClick={this.handleRandom} key='random' >Random</Button>,
      <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.TAGS} key='tags' >Tags</Button>,
      <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.INFO} key='info' >Info</Button>,
    ];

    const authItem = authUser ? [
      <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.UPLOAD} key='upload' ><CloudUploadIcon className={classes.margin} />Upload a game</Button>,
      <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.FAVORITE} key='favorite' ><FavoriteIcon className={classes.margin} />Favorites</Button>,
      <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.ACCOUNT} key='user' ><PersonIcon className={classes.margin} />{authUser && authUser.displayName}</Button>,
      <Button className={classes.btn} onClick={this.handleSignout} key='signout'><ExitToAppIcon className={classes.margin} />Sign Out</Button>,
    ] : [
        <Button className={classes.btn} onClick={this.handleClear} component={Link} to={ROUTES.SIGN_IN} key='signin' ><ExitToAppIcon className={classes.margin} />Sign In</Button>,
      ];

    const menuMd = (
      <Grid container justify='space-between' className={classes.menu}>
        <Grid item className={classes.md}>
          {constItem}
        </Grid>
        <Grid item className={classes.md}>
          {authItem}
        </Grid>
        <Grid item className={classes.sm}>
          <Button className={classes.btn} onClick={this.handleMenuSm} ><MenuIcon className={classes.margin} /></Button>
        </Grid>
      </Grid>
    )

    const menuSm = (
      <Grid container direction='column' className={classes.sm}>
        {constItem.map(item => (
          <Grid container item justify='center' key={item.key} >{item}</Grid>
        ))}
        {authItem.map(item => (
          <Grid container item justify='center' key={item.key} >{item}</Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <AppBar position="static" color="primary" className={classes.bar}>

          <Toolbar>
            <Button onClick={this.handleClear} component={Link} to={ROUTES.HOME} ><img src={logo} alt="home" style={{ height: '40px' }} /></Button>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                fullWidth
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={this.onChange}
                value={value}
                onKeyPress={this.hendleEnterPress}
              />
            </div>
            {menuMd}
          </Toolbar>
        </AppBar>
        {showMenu && menuSm}
      </div>
    );
  }
}

NavigationMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

const NavigationBar = withRouter(withFirebase(withStyles(styles)(NavigationMenu)));

export default Navigation;