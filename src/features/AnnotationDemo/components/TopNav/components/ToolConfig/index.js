import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash'

import { useGeneralStore } from '../../../../stores/index'

// import EditConfig from './ConfigComponent/EditConfig'
import BBoxConfig from './ConfigComponent/BBoxConfig'
import PolygonConfig from './ConfigComponent/PolygonConfig'
import MaskBrushConfig from './ConfigComponent/MaskBrushConfig'
import MaskConfig from './ConfigComponent/MaskConfig'
import ReferringExpressionConfig from './ConfigComponent/ReferringExpressionConfig'

import { MODES } from '../../../../constants'


const useStyles = makeStyles(() => ({
  toolConfigWrapper: {
    flex: 1,
  }
}))

const toolBoxConfigs = {
  // [MODES.EDIT.name]: EditConfig,
  [MODES.DRAW_BBOX.name]: BBoxConfig,
  [MODES.DRAW_POLYGON.name]: PolygonConfig,
  [MODES.DRAW_MASK_BRUSH.name]: MaskBrushConfig,
  [MODES.DRAW_MASK.name]: MaskConfig,
  [MODES.REFERRING_EXPRESSION.name]: ReferringExpressionConfig,
}

const ToolConfig = (props) => {
  const classes = useStyles()

  const activeMode = useGeneralStore(state => state.activeMode)
  const toolConfig = useGeneralStore(state => state.toolConfig[activeMode] || {})
  const setToolConfig = useGeneralStore(state => state.setToolConfig)

  const ActiveConfigComponent = get(toolBoxConfigs, activeMode, null)

  return (
    <div className={classes.toolConfigWrapper}>
      {ActiveConfigComponent &&
        <ActiveConfigComponent
          toolConfig={toolConfig}
          setToolConfig={setToolConfig}
        />
      }
    </div>
  )
}

export default ToolConfig