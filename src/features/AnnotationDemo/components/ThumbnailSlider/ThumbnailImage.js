import React from 'react'
import { makeStyles } from '@material-ui/core'

import { theme } from '../../../../theme'


const useStyles = makeStyles((props) => ({
  imageWrapper: {
    display: 'inline-block',
    height: 60,
    width: 100,
    borderRadius: 5,
    padding: 5,
    margin: 5,
    backgroundColor: 'white',
    borderColor: props => props.isSelected ? theme.light.secondaryColor : 'rgba(0, 0, 0, 0)',
    borderStyle: 'solid'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
}))

const ThumbnailImage = (props) => {
  const {
    id,
    thumbnail,
    setSelectedId
  } = props
  const classes = useStyles(props)
  return (
    <div className={classes.imageWrapper}>
      <img className={classes.image} src={thumbnail} alt='' onClick={() => setSelectedId(id)} />
    </div>
  )
}

export default ThumbnailImage