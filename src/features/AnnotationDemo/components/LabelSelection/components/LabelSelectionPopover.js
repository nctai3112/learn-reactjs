import React from 'react'
import Popover from '@material-ui/core/Popover'


import {TextField} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab'

// TODO: handle visibility
const ClassSelectionPopover = (props) => {
  const { contextMenuPosition, labels, handleSelectLabel, handleClose} = props
  const [selectedValue, setValue] = React.useState('')

  return (
    <Popover
      open
      anchorReference="anchorPosition"
      anchorPosition={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Autocomplete
        options={labels}
        style={{ width: 300 }}
        getOptionLabel={(options) => options.label || ''}
        value={selectedValue}
        onChange={(event, newValue) => {
          if (newValue) {
            setValue(newValue);
            handleSelectLabel(newValue.id)
          }
          else {
            setValue(null)
            handleSelectLabel(null)
          }
        }}
        autoHighlight
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a class"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
    </Popover>
  )
}

export default ClassSelectionPopover
