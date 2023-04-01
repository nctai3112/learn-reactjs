import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import MenuList from '@material-ui/core/MenuList';
import BounceLoader from 'react-spinners/BounceLoader'
import { makeStyles, SvgIcon } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles';
import { find } from 'lodash'

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { ReactComponent as SendIcon } from '../../../../../../../static/images/icons/ConfigIcon/send.svg'


const useStyles = makeStyles(theme => ({
  button: {
    margin: 10,
    borderRadius: 5,
    // padding: 5,
    backgroundColor: theme.palette.secondary.lighter,
    overflow: 'hidden',
    color: theme.palette.primary.dark,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.primary.darker,
    },
  },
}))

const ToolConfigPopUpButton = (props) => {
  const classes = useStyles(props)
  const theme = useTheme()
  const { name, component, options, children, value, handleClick, handleSelect, isLoading, ...others } = props

  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Tooltip title={name} placement="top">
        <ButtonGroup
          size="small" variant="default"
          className={classes.button} ref={anchorRef} aria-label="split button"
          {...others}
        >
          <Button
            size="small"
            onClick={handleClick}
            style={{ textTransform: 'none' }}
            startIcon={
              isLoading ?
                <BounceLoader size={15} className={classes.icon} color={theme.palette.secondary.main} />
                :
                <SvgIcon fontSize="small">
                  <SendIcon />
                </SvgIcon>
            }
          >
            {find(options, { value })?.name}
          </Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select referring expression model strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
      </Tooltip>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 100 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === value}
                      onClick={() => handleSelect(option.value)}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default ToolConfigPopUpButton
