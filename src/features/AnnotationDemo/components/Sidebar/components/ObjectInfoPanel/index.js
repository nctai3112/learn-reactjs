import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import { find } from 'lodash'

import { useAnnotationStore } from '../../../../stores/index'

import ArrowRightIcon from '@material-ui/icons/ChevronRightRounded'
import ArrowDownIcon from '@material-ui/icons/ExpandMoreRounded'
import DeleteIcon from '@material-ui/icons/DeleteForeverRounded'

import ObjectInfo from './ObjectInfo'


const useStyles = makeStyles((theme) => ({
  header: {
    cursor: 'pointer',
    background: theme.palette.primary.dark,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
    color: theme.palette.primary.contrastText,
  },
  titleCount: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    fontSize: 12,
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  divider: {
    background: theme.palette.secondary.main
  },
  listContainer: {
    width: '100%',
    padding: 0,
    background: theme.palette.primary.light,
  }
}))

const ObjectInfoPanel = (props) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(true)

  const selectedObjectId = useAnnotationStore(state => state.selectedObjectId)
  const setSelectedObjectId = useAnnotationStore(state => state.setSelectedObjectId)
  const annotationObjects = useAnnotationStore(state => state.annotationObjects)
  const deleteAnnotationObject = useAnnotationStore(state => state.deleteAnnotationObject)
  const labels = useAnnotationStore(state => state.labels)
  const setAnnotationObjectProperties = useAnnotationStore(state => state.setAnnotationObjectProperties)
  const setAnnotationObjectLabel = useAnnotationStore(state => state.setAnnotationObjectLabel)

  const toggleVisibility = (id, isHidden) => {
    setAnnotationObjectProperties(id, { isHidden })
  }

  const objectList = annotationObjects.map((obj) => ({
    ...obj,
    label: find(labels, { id: obj.labelId })
  }))
  

  return (
    <Grid container>
      <Grid container item xs={12} direction="row" alignItems="center" className={classes.header}
        onClick={() => setIsOpen(isOpen => {
          if (isOpen) setSelectedObjectId(null)
          return !isOpen
        })}
      >
        <Grid container item direction="row" alignItems="center" xs={2}>
          {isOpen ? 
            <ArrowDownIcon color="secondary"/>
            : <ArrowRightIcon color="secondary"/>
          }
        </Grid>
        <Grid container item xs={8} direction="row" alignItems="center">
          <Grid item className={classes.title}>Objects</Grid>
          <Grid item className={classes.titleCount}>{annotationObjects.length}</Grid>
        </Grid>
        <Grid container item xs={2} justifyContent="flex-start">
          {/* <Divider orientation="vertical" flexItem className={classes.divider} /> */}
        </Grid>
      </Grid>
      <Grid container item xs={12}>
        <Collapse in={isOpen || selectedObjectId} className={classes.listContainer}>
          <List className={classes.listContainer}>
            {objectList.map(obj => {
                return (
                  <ObjectInfo 
                    key={obj.id}
                    annotationObject={obj}
                    isSelected={obj.id === selectedObjectId}
                    labels={labels}
                    setSelectedObjectId={setSelectedObjectId}
                    setAnnotationObjectLabel={setAnnotationObjectLabel}
                    toggleVisibility={toggleVisibility}
                    deleteAnnotationObject={deleteAnnotationObject}
                  />
                )
              })
            }
          </List>
        </Collapse>
      </Grid>
    </Grid>
  )
}

export default ObjectInfoPanel