import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'

import { useDatasetStore } from '../../../../stores/index'

const useStyles = makeStyles(theme => ({
  root: {

  },
  name: {
    fontWeight: 500,
    fontSize: 14,
    color: theme.palette.primary.contrastText,
    whiteSpace: 'nowrap',
    maxWidth: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))

const DataInfo = (props) => {
  const classes = useStyles()

  const getDataInstance = useDatasetStore(state => state.getDataInstance)
  const dataInstance = getDataInstance()
  const dataInstanceName = get(dataInstance, 'name', '')

  return (
    <div className={classes.root}>
      <div className={classes.name}>
        {dataInstanceName}
      </div>
    </div>
  )
}

export default DataInfo