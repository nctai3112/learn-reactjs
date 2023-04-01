import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { ErrorMessage } from 'formik'


const StyledFormControl = withStyles(theme => ({
  root: props => ({
    width: props.fullWidth && '100% !important',
    maxWidth: '100% !important',
    marginTop: 10,
    marginBottom: 10,
    "& label": {
      lineHeight: 1.5,
      width: '95%'
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
    }
  })
}))(FormControl)

const Input = (props) => {
  const { field = {}, form, label, options, required, type, variant, error, touched, helperText, fullWidth, style = {}, ...others } = props
  const inputLabel = React.useRef(null);

  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth + (!fullWidth ? 200 : 0));
  }, [fullWidth]);
  return (
    <StyledFormControl
      required={required}
      variant={variant}
      error={Boolean(error && touched)}
      {...others}
      style={{ width: labelWidth, ...style }}
      fullWidth={fullWidth}
    >
      <InputLabel ref={inputLabel}>
        {label}
      </InputLabel>
      <Select
        labelWidth={labelWidth}
        {...field}
        autoWidth
      >
        {
          (options || []).map(option => (
            <MenuItem
              key={option.value}
              {...option}
            >
              {option.label}
            </MenuItem>
          ))
        }
      </Select>
      <FormHelperText error>
        <ErrorMessage name={field.name} />
      </FormHelperText>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </StyledFormControl>
  )
}

export default (Input)


