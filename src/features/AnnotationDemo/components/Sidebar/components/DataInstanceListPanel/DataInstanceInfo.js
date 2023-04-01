import React from 'react'
import { makeStyles, SvgIcon } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx'

import ImageDataInstanceClass from '../../../../../../classes/ImageDataInstanceClass';
import VideoDataInstanceClass from '../../../../../../classes/VideoDataInstanceClass';

import ImageIcon from '@material-ui/icons/Image';
import VideoIcon from '@material-ui/icons/Movie';

const useStyles = makeStyles((theme) => ({
  container: {
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  selectedContainer: {
    background: '#c5defc',
    borderRadius: '5px 5px 0px 0px',
  },
  objectId: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 10,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  divider: {
    background: theme.palette.primary.main
  },
  infoContainerCollapse: {
    width: '100%',
    justifyContent: 'center',
    background: '#c5defc',
    '&.MuiCollapse-entered': {
      borderRadius: '0px 0px 5px 5px',
    }
  },
  infoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
}))

const mapDataInstanceClsToIcon = {
  [ImageDataInstanceClass._cls]: ImageIcon,
  [VideoDataInstanceClass._cls]: VideoIcon
}

const DataInstanceInfo = (props) => {
  const classes = useStyles()
  const { 
    isSelected, 
    dataInstance,
    setSelectedInstanceId,
  } = props


  const { id, name, thumbnail } = dataInstance
  const InstanceIcon = mapDataInstanceClsToIcon[dataInstance.__proto__.constructor._cls]

  return (
    <>
      <ListItem className={clsx(classes.container, isSelected && classes.selectedContainer)}
        onClick={() => {
          if (!isSelected) {
            setSelectedInstanceId(id)
          }
        }}
      >
        <ListItemIcon style={{ alignItems: 'center', marginRight: 10 }}>
          <Avatar
            variant="rounded"
            src={thumbnail?.URL}
            className={classes.avatar}
          />
        </ListItemIcon>
        <ListItemText 
          primary={name}
          secondary={
            <div className={classes.objectId}>
              ID: {id}
            </div>
          }
          className={classes.objectId}
        />
        <ListItemSecondaryAction>
          <InstanceIcon/>
        </ListItemSecondaryAction>
      </ListItem>
      {/* <Collapse in={isSelected} className={classes.infoContainerCollapse}>
        <Divider className={classes.divider} variant="middle" light/>
      </Collapse> */}
    </>
  )
}

export default DataInstanceInfo