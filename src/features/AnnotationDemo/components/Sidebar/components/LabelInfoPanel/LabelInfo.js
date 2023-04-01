import React from 'react'
import { makeStyles } from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { get } from 'lodash'

import EditIcon from '@material-ui/icons/Edit';

import { DEFAULT_ANNOTATION_ATTRS } from '../../../../constants'

const useStyles = makeStyles((theme) => ({
  colorIndicator: {
    display: 'inline-block',
    height: 15,
    width: 15,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 15,
  }
}))

const LabelInfo = (props) => {
  const classes = useStyles()
  const { labelObject } = props

  const fillColor = get(labelObject, 'annotationProperties.fill', DEFAULT_ANNOTATION_ATTRS.fill)
  const strokeColor = get(labelObject, 'annotationProperties.stroke', DEFAULT_ANNOTATION_ATTRS.stroke)

  return (
    <ListItem>
      <ListItemIcon>
        <div 
          className={classes.colorIndicator}
          style={{
            background: fillColor,
            borderColor: strokeColor
          }}
        >
        </div>
      </ListItemIcon>
      <ListItemText primary={labelObject.label} />
      <ListItemSecondaryAction>
        <IconButton size="small">
          {/* TODO: handle edit label */}
          <EditIcon fontSize="small"/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default LabelInfo