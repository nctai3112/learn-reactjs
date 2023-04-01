import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import { useLocation } from "react-router-dom";
import clsx from 'clsx';

import { navBarItems } from './constants'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  nav_bar_item: {
    marginRight: 20,
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textTransform: 'capitalize',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      boxShadow: 'none',
      color: theme.palette.primary.contrastText,
    },
  },
  active_item: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  }
}));

const NavBarItem = (props) => {
  const classes = useStyles()
  const location = useLocation()

  return (
    <div className={classes.root}>
      {
        navBarItems.map(item => {
          const { name, path } = item
          const isMatchRoute = (location.pathname === path)

          return (
            !isMatchRoute?
            <Button 
              key={name} 
              color="inherit" 
              size="small"
              className={clsx(classes.nav_bar_item, isMatchRoute && classes.active_item)}
              href={path}
            >
              {name}
            </Button>
            : null
          )
        })
      }
    </div>
  )
}

export default NavBarItem