import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'

import './index.css'

const useStyles = makeStyles(theme => ({
  emptyItem: {
    height: 60,
    width: 50,
    paddingLeft: 5,
    paddingRight: 5,
  },
}))


const EmptyItem = (props) => {
  const classes = useStyles()
  const { className } = props

  return (
    <Grid container direction="column" alignItems="center" justifyContent="space-evenly"
      className={clsx(classes.emptyItem, className)}
      {...props}
    >
    </Grid>
  )
}

export default EmptyItem