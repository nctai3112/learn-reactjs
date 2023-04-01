import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormHelperText from "@material-ui/core/FormHelperText";
import { ErrorMessage } from 'formik'


const ValidationTextField = withStyles(theme => ({
  root: props => ({
    width: props.fullWidth && '100% !important',
    marginTop: 10,
    marginBottom: 10,
    "& label": {
      lineHeight: 1.5,
      width: '95%',
    },
    "& input:valid + fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2
    },
    "& input:invalid + fieldset": {
      borderColor: theme.palette.secondary.main,
      borderWidth: 2
    },
    "& input:valid:focus + fieldset": {
      borderLeftWidth: 6,
      padding: "4px !important" // override inline-style
    },
    [theme.breakpoints.down('sm')]: (props.variant === 'standard') &&{
      marginTop: 20,
      "& .MuiInputLabel-formControl": {
        transform: 'translate(0, -5px) scale(1)',
      },
      "& .MuiInputLabel-shrink": {
        transform: 'translate(0, -20px) scale(0.75)',
      },
    },
  })
}))(TextField);

const styles = (theme) => ({
  helperText: {
    margin: 0,
  },
})

const Input = (props) => {
  const { 
    classes, field = {}, form, meta,
    label, required, type, variant, helperText, 
    error, touched, fullWidth, ...others 
  } = props

  return (
    <React.Fragment>
      <ValidationTextField
        label={label}
        required={required}
        type={type}
        variant={variant}
        {...field}
        {...others}
        fullWidth={fullWidth}
      />
      <FormHelperText error>
        <ErrorMessage name={field.name}/>
      </FormHelperText>
      {helperText && <FormHelperText className={classes.helperText}>{helperText}</FormHelperText> }
    </React.Fragment>
  )
}

export default withStyles(styles)(Input)
