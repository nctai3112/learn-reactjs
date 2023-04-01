import React from 'react'
import clsx from 'clsx';
import { InvisibleIcon, VisibleIcon } from './SidebarIcon'
import { theme } from '../../../../../theme'

import {
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

const styles = {
  icon: {
    width: 15,
    height: 15
  }
}

const useStyles = makeStyles((props) => ({
  showClassWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: theme.light.secondaryColor,
    borderRadius: 5,
    marginBottom: 5
  },
  table: {
    backgroundColor: theme.light.tertiaryColor,
    borderRadius: 5,
    marginBottom: 20
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: props.transitions.create('transform', {
      duration: props.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));


const columns = [
  { field: 'shortenId', headerName: 'ID', width: 30 },
  { field: 'type', headerName: 'Type', width: 100 },
]

const LabelList = (props) => {
  const classes = useStyles();
  const { useStore, classLabel, annotations } = props
  const [expanded, setExpanded] = React.useState(true)

  const { id, label, properties } = classLabel
  const setAnnotationProperties = useStore(state => state.setAnnotationProperties)
  const setLabelProperties = useStore(state => state.setLabelProperties)

  const toggleClassVisibility = (isHidden) => {
    setLabelProperties(id, { isHidden })
  }

  const toggleVisibility = (id, isHidden) => {
    setAnnotationProperties(id, { isHidden })
  }

  const rows = annotations.map((annotation) => {
    return {
      id: annotation.id,
      shortenId: annotation.id.slice(0, 5),
      type: annotation.type,
      isHidden: annotation.properties.isHidden
    }
  })

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div className={classes.showClassWrapper}>
        <label>
          {label}
        </label>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>
      <Collapse in={expanded}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 10 }}>
                <div style={styles.icon} onClick={() => toggleClassVisibility(!properties.isHidden)}>
                  {properties.isHidden ? InvisibleIcon : VisibleIcon}
                </div>
              </TableCell>
              {columns.map((column) => (
                <TableCell style={{ width: column.width }} key={column.field}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 10 }}>
                  <div style={styles.icon} onClick={() => toggleVisibility(row.id, !row.isHidden)}>
                    {row.isHidden ? InvisibleIcon : VisibleIcon}
                  </div>
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.field}>
                    {row[`${column.field}`]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </>
  )
}

export default LabelList