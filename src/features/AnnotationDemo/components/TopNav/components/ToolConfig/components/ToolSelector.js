import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ToolConfigButton from './ToolConfigButton'

const useStyles = makeStyles(() => ({
  toolSelectorWrapper: {
    display: 'flex',
    alignItems: 'center',
  }
}))

const ToolSelector = (props) => {
  const classes = useStyles()
  const { activeTool, toolList, onSelect } = props
  return (
    <div className={classes.toolSelectorWrapper}>
      {
        toolList.map((btn) => {
          const { name, component, tool, } = btn
          return (
            <ToolConfigButton
              key={`tool-type-${name}`}
              name={name}
              handleClick={() => onSelect(tool)}
              isActive={activeTool === tool}
              component={component}
            />
          )
        })
      }
    </div>
  )
}

export default ToolSelector