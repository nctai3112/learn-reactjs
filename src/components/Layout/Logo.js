import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import LogoImage from '../../static/images/logo/logo.png'

const useStyles = makeStyles((theme) => ({
  logo: {
    height: 35
  },
}));

const Logo = (props) => {
  const classes = useStyles()

  return (
    <a href='/'>
      <img src={LogoImage} className={classes.logo} alt='logo'/>
    </a>
  )
}

export default Logo