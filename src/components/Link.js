import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const styles = (theme => ({
  link: {
    color: 'inherit',
    textDecoration: 'none',
  }
}))

const CustomLink = (props) => {
  const { classes, className, ...other } = props
  return (
    <Link className={clsx(classes.link, className)} style={{ textDecoration: 'unset' }} draggable={false} {...other} />
  )
}

export default withStyles(styles)(CustomLink)