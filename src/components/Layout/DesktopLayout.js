import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// import Logo from './Logo'
import NavBarItems from './NavBarItems'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flexGrow: 1,
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
  }
}));

const DesktopLayout = (props) => {
  const classes = useStyles()
  const { children } = props

  return (
    <div className={classes.root}>
      <AppBar position="static" color="white" elevation={1}>
        <Toolbar style={{ minHeight: 40 }}>
          <div className={classes.leftSection}>
            {/* <Logo href='/'/> */}
            <NavBarItems />
          </div>
          <div className={classes.centerSection}>

          </div>
          <div className={classes.rightSection}>
            {/* <NavBarItems/> */}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.mainContainer}>
        {children}
      </div>
    </div>
  );
}

export default DesktopLayout
