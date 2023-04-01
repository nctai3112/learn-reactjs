import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// import Logo from './Logo'
import Sidebar from './SideBar'

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

const MobileLayout = (props) => {
  const classes = useStyles()
  const { children } = props

  const [ isSidebarOpen, setIsSidebarOpen ] = useState(false)

  const toggleSidebar = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsSidebarOpen(open)
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="white" elevation={1}>
        <Toolbar style={{ minHeight: 40 }}>
          <div className={classes.leftSection}>
            <IconButton 
              edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
              onClick={toggleSidebar(!isSidebarOpen)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div className={classes.centerSection}>
            {/* <Logo href='/'/> */}
          </div>
          <div className={classes.rightSection}>
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className={classes.mainContainer}>
        {children}
      </div>
    </div>
  );
}

export default MobileLayout

