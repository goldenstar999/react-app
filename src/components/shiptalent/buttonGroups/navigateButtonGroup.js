import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import styles from 'styles';

class NavigateButtonGroup extends Component {

  render() {
    const {
      backLink, backButtonTitle, backButtonClass, handleClickBackButton,
      nextLink, nextButtonTitle, nextButtonClass, handleClickNextButton,
      direction, classes
    } = this.props;

    let gridContainerProps = { }
    if (direction === 'column') {
      gridContainerProps = {
        direction,
        justify: "flex-end",
        alignItems: "flex-end"
      }
    }


    return (
      <Grid container spacing={24} {...gridContainerProps}>
        <Grid item xs={5} md={5}>
          { backLink && (
            <Link to={backLink} onClick={handleClickBackButton}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={backButtonClass ? backButtonClass: classes.defaultBackButtonClass}
              >
                {backButtonTitle ? backButtonTitle : 'Back'}
              </Button>
            </Link>
          )}
        </Grid>
        {direction !== 'column' &&  <Grid item xs={2} md={2} /> }
        <Grid item xs={5} md={5} className={classes.clientFormNextButtonContainerGridItem}>
          {nextLink && (
            <Link to={nextLink} onClick={handleClickNextButton}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth={false}
                className={nextButtonClass ? nextButtonClass : classes.nextButtonClass}
              >
                {nextButtonTitle ? nextButtonTitle : 'Next'}
              </Button>
            </Link>
          )}
        </Grid>
      </Grid>
    )
  }
}

export default (withStyles(styles)(NavigateButtonGroup));
