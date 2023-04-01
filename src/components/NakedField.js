import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import FormHelperText from '@material-ui/core/FormHelperText';
import { ErrorMessage } from 'formik'

const styles = (theme => ({
  root: {
    width: '100%'
  },
  label: {
    display: 'inline-block',
    marginRight: 10,
    lineHeight: 1.5,
    fontWeight: 'bold'
  },
}))

const Input = (props) => {
  const { classes, label, children, field = {}, form, style, name, helperText, ...others } = props;

  return (
    <div className={classes.root}>
      {label && <span className={classes.label}>{label}</span>}
      <InputBase 
        {...field} 
        style={{
          ...style, 
          boxSizing: 'border-box',
          padding: 2,
          width: '100%', 
          flex: 1, 
          background: 'transparent',
        }} 
        {...others}
      >
        {children}
      </InputBase>
      {field.name &&
        <FormHelperText error>
          <ErrorMessage name={field.name} />
        </FormHelperText>
      }
      {helperText && <FormHelperText className={classes.helperText}>{helperText}</FormHelperText>}
    </div>
  )
}

export default withStyles(styles)(Input);