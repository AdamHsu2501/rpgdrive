import React, { Component } from 'react';
import '../../index.css';
import { Link } from 'react-router-dom';
import languages from 'languages';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { /*Avatar,*/ Badge, Card, CardActionArea, CardActions, CardContent, Chip, Grid, Typography } from '@material-ui/core';
// import SwipeableViews from 'react-swipeable-views';
// import { autoPlay } from 'react-swipeable-views-utils';

import * as ROUTES from '../../constants/routes';
import logo from '../../logoFooter.svg';
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = theme => ({
    root: {
        width: '100%',
    },
    card: {
        width: '100%',
        background: '#404040',
        margin: theme.spacing(0.5),
    },
    img: {
        display: 'block',
        width: '100%',
    },
    content: {
        padding: theme.spacing(1),
    },
    title: {
        overflowWrap: "break-word"
    },
    chipContent: {
        flexWrap: 'wrap',
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
    },
    avatar: {
        borderRadius: 4,
        width: 175,
        height: 150,
    }
});

class CardItem extends Component {
    state = {
        activeStep: 0,
    };

    handleStepChange = activeStep => {
        this.setState({ activeStep });
    };

    onError = () => {
        this.img.src = logo
    }

    render() {
        var { classes, item, authUser, game, /*theme*/ } = this.props;
        // const { activeStep } = this.state;
        var icon, iconUrl, moreInfo;
        // const imgs = [];
        if (item.image) {
            // item.image.forEach(key => {
            //     var id = key.replace('.', '_');
            //     imgs.push({
            //         label: key,
            //         url: item.imgUrl[id],
            //     })
            // })


            icon = true;
            iconUrl = item.imgUrl[item.image[0].replace('.', '_')];
            moreInfo = true;
        } else if (item.avatar) {
            icon = true;
            iconUrl = item.avatar;
            moreInfo = false;
        } else {
            icon = false;
            moreInfo = false;
        }

        const tags = [];
        if (item.language) {
            item.language.forEach(val => {
                tags.push(languages.getLanguageInfo(val).nativeName);
            })
        }

        if (item.tag) {
            const len = item.tag.length > 3 ? 3 : item.tag.length;
            for (var i = 0; i < len; i++) {
                tags.push(item.tag[i])
            }
        }

        var pathname = game ? ROUTES.GAME : ROUTES.ACCOUNT

        var invisible = true;
        if (authUser && authUser.notice) {
            if (authUser.notice[item.uid]) {
                invisible = false;
            }
        }

        return (
            <Badge color="secondary" variant="dot" invisible={invisible} className={classes.root}>
                <Card className={classes.card} >
                    <Link to={{ pathname, search: `?id=${item.uid}`}} className={classes.link}>
                        <CardActionArea>
                            <img 
                                className={classes.img}
                                src={icon ? iconUrl : logo}
                                alt='icon'
                                onError={this.onError}
                                ref={(f) => this.img = f}
                            />
                        <CardContent className={classes.content}>
                            <Typography className={classes.title} color="textPrimary">
                                {item.displayName}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Link>
                {moreInfo && (
                    <CardActions className={classes.chipContent}>
                        <Grid container justify="space-between" direction="row-reverse">
                            {parseFloat(item.price) > 0 ? (
                                <Chip
                                    label={'$' + item.price}
                                    className={classes.chip}
                                    variant="outlined"
                                />
                            ) : (
                                    <Chip
                                        label='FREE'
                                        className={classes.chip}
                                    />
                                )}

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

                        </Grid>


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
                    </CardActions>
                )}
                </Card>
            </Badge >
        );
    }
}

CardItem.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CardItem);

