import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import DialogContent from '@material-ui/core/DialogContent'
import FadeLoader from 'react-spinners/FadeLoader'

const styles = (theme => ({
  loading: {
    width: '100%',
    height: '100%',
    position: 'fix',
    top: 0,
    left: 0,
    background: '#00000000',
    zIndex: 10000
  },
  modal: {
    width: '100%',
    '& .css-1smlpex': {
      outline: 'none'
    }
  },
  content: {
    width: '100%',
    height: '100%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}))

const Loading = (props) => {
  const { isLoading = {} , classes, Loader = FadeLoader } = props

  if (isLoading === true || Object.keys(isLoading).reduce((prevValue, value) => (prevValue || isLoading[value]) ,false)) {
    return (
      <Paper tabIndex={-1} className={classes.loading}>
        <Modal className={classes.modal} open>
          <DialogContent className={classes.content}>
            <Loader/>
          </DialogContent>
        </Modal>
      </Paper>
    )
  }
  return null
}

export default withStyles(styles)(Loading)