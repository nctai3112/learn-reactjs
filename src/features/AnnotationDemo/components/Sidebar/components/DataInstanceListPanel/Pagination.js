import React from 'react'
import { ListItem, Typography } from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination';


const DataPagination = (props) => {
  const { page, count, handlePageChange } = props
  return (
    <ListItem>
      <Typography>Page: {page}</Typography>
      <Pagination count={count} page={page} onChange={handlePageChange} size="small"/>
    </ListItem>
  )
}


export default DataPagination