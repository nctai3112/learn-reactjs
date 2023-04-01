import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useLocation } from 'react-router-dom'

import { navBarItems } from './constants'

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  active_item: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '& span': {
      fontWeight: 'bold',
    }
  }
}));

const SideBar = (props) => {
  const classes = useStyles();
  const { isSidebarOpen, toggleSidebar } = props
  const location = useLocation()

  return (
    <Drawer anchor={'left'} open={isSidebarOpen} onClose={toggleSidebar(false)}>
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleSidebar(false)}
        onKeyDown={toggleSidebar(false)}
      >
        <List>
          {
            navBarItems.map(item => {
              const { name, path } = item
              const isMatchRoute = (location.pathname === path)

              return (
                <ListItem button
                  component="a"
                  key={name}
                  color="inherit"
                  href={path}
                  className={clsx(classes.sidebar_item, isMatchRoute && classes.active_item)}
                >
                  <ListItemText primary={name} />
                </ListItem>
              )
            })
          }
        </List>
        <Divider />
        <List>
        </List>
      </div>
    </Drawer>
  );
}

export default SideBar
