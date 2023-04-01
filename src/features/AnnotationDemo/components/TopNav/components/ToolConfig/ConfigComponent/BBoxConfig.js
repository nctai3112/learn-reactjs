import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import EventCenter from '../../../../../EventCenter'

import ToolConfigButton from '../components/ToolConfigButton'
import { ReactComponent as DeleteIcon } from '../../../../../../../static/images/icons/ConfigIcon/delete.svg'

import { EVENT_TYPES } from '../../../../../constants'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: '80%',
  },
  optionContainer: {
    marginLeft: 10,
    marginRight: 10,
    display: 'flex',
  },
}))


const BBoxConfig = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.optionContainer}>
        <ToolConfigButton
          name={'Delete annotation'}
          handleClick={EventCenter.emitEvent(EVENT_TYPES.EDIT.DELETE_ANNOTATION)}
          component={<DeleteIcon/>}
        />
      </div>
    </div>
  )
}

export default BBoxConfig