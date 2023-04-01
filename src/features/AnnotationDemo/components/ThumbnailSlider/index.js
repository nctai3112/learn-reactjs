import React, { useState } from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import ShowMoreIcon from '@material-ui/icons/UnfoldMore';
import ShowLessIcon from '@material-ui/icons/UnfoldLess';
import { useParams, useHistory } from 'react-router'
import { get } from 'lodash'

import EventCenter from '../../EventCenter';

import { IMAGES_PER_PAGE } from '../../constants'
import { EVENT_TYPES } from '../../constants'
import useQuery from '../../../../utils/useQuery'
import { useDatasetStore } from '../../stores/index'

import ThumbnailImage from './ThumbnailImage'
import { theme } from '../../../../theme'

const useStyles = makeStyles((props) => ({
  sliderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    background: theme.light.forthColor,
    height: 100,
  },
  pageInfo: {
    fontWeight: 500,
    width: 100,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  thumbnailWrapper: {
    whiteSpace: 'nowrap',
    width: '100%',
    alignItems: 'center',
    overflowY: 'hidden',
    overflowX: 'scroll',
    "&::-webkit-scrollbar": {
      height: 5,
    },
    "&::-webkit-scrollbar-track": {
      height: 5,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.light.secondaryColor,
      height: 5,
      borderRadius: 5
    },
  },
  button: {
    borderRadius: 0
  },
}))


const ThumbnailSlider = (props) => {
  const classes = useStyles()
  const { datasetId } = useParams()
  let query = useQuery()
  let history = useHistory()

  const page = JSON.parse(query.get("page") || 1)


  const dataset = useDatasetStore(state => state.dataset)
  const dataInstances = useDatasetStore(state => state.dataInstances)
  const instanceId = useDatasetStore(state => state.instanceId)
  const setInstanceId = useDatasetStore(state => state.setInstanceId)


  const instances = get(dataset, 'instances', 0)
  const maxPage = Number.parseInt((instances / IMAGES_PER_PAGE) + Boolean(instances % IMAGES_PER_PAGE))


  const handleChangePage = async (val) => {
    let newPage = page + val

    newPage = (Math.max(Math.min(maxPage, newPage), 1))

    if (newPage !== page) {
      history.replace(`/annotations/dataset=${datasetId}?page=${newPage}`)
    }
  }

  const [isShowing, setIsShowing] = useState(true)

  return (
    <>
      <IconButton 
        size="small" 
        className={classes.button} 
        style={{ background: theme.light.forthColor, width: '100%' }}
        onClick={() => {
          setIsShowing(isShowing => !isShowing)
          setTimeout(EventCenter.emitEvent(EVENT_TYPES.RESIZE_STAGE), 350)
        }}
      >
        {isShowing ?
          <ShowLessIcon fontSize="small" color="primary"/>
          : <ShowMoreIcon fontSize="small" color="primary"/>
        }
      </IconButton>
      <Collapse in={isShowing} timeout={300}>
        <div className={classes.sliderWrapper}>
          <div className={classes.pageInfo}>
            <div>{`Page: ${Math.min(page, maxPage)}`}</div>
            <div>{`Total: ${maxPage}`}</div>
          </div>
          <IconButton onClick={() => handleChangePage(-1)} className={classes.button}>
            <KeyboardArrowLeft />
          </IconButton>
          <div className={classes.thumbnailWrapper}>
            {dataInstances.map((instance) => {
              return (
                <ThumbnailImage
                  id={instance.id}
                  key={`thumbnail-image-${instance.id}`}
                  isSelected={instance.id === instanceId}
                  setSelectedId={() => setInstanceId(instance.id)}
                  thumbnail={instance.thumbnail.URL}
                />)
            })}
          </div>
          <IconButton onClick={() => handleChangePage(1)} className={classes.button}>
            <KeyboardArrowRight />
          </IconButton>
        </div>
      </Collapse>
    </>
  )
}

export default ThumbnailSlider