import React from 'react'
import {
  makeStyles,
  Avatar,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Button,
  Link,
  Box
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import Logo from '../../../assets/images/logo.png'
import WhiteLogo from '../../../assets/images/whitelogo.png'
import Copyright from '../../../components/Copyright'
import { useCustomTheme } from '../../../context/useCustomTheme'
import { registerSchema } from '../../../validation/registerSchema'
import { useAuth } from '../../../context/useAuth'

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const breadcrumb = 'src.pages.login'

export default function RegisterTab({ setOpen, handleChangeTabIndex }) {
  const classes = useStyles()
  const { darkState } = useCustomTheme()
  const { t } = useTranslation()
  let { register } = useAuth()

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    resetForm,
    setFieldValue
  } = useFormik({
    initialValues: {
      username: 'chnirt',
      password: '0',
      confirmPassword: '0',
      checked: true
    },
    validationSchema: registerSchema,
    onSubmit: async values => {
      // alert(JSON.stringify(values, null, 2))

      setOpen(true)
      const result = await register(values.username, values.password)

      if (result) {
        handleChangeTabIndex(0)

        resetForm()
      }
      setOpen(false)
    }
  })

  return (
    <div className={classes.paper}>
      <Avatar
        variant="square"
        className={classes.avatar}
        src={darkState ? WhiteLogo : Logo}
      />
      <Typography component="h1" variant="h5">
        {t(`${breadcrumb}.RegisterPage`)}
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="username"
            autoComplete="username"
            id={
              errors.username && touched.username
                ? 'standard-error-helper-text'
                : 'username'
            }
            label={
              errors.username && touched.username
                ? 'Error Username'
                : t(`${breadcrumb}.Username`)
            }
            error={errors.username && touched.username ? true : false}
            helperText={
              errors.username && touched.username ? errors.username : false
            }
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            autoComplete="current-password"
            type="password"
            id={
              errors.password && touched.password
                ? 'standard-error-helper-text'
                : 'password'
            }
            label={
              errors.password && touched.password
                ? 'Error Password'
                : t(`${breadcrumb}.Password`)
            }
            error={errors.password && touched.password ? true : false}
            helperText={
              errors.password && touched.password ? errors.password : false
            }
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            autoComplete="confirm-password"
            type="password"
            id={
              errors.confirmPassword && touched.confirmPassword
                ? 'standard-error-helper-text'
                : 'confirmPassword'
            }
            label={
              errors.confirmPassword && touched.confirmPassword
                ? 'Error Confirm Password'
                : t(`${breadcrumb}.ConfirmPassword`)
            }
            error={
              errors.confirmPassword && touched.confirmPassword ? true : false
            }
            helperText={
              errors.confirmPassword && touched.confirmPassword
                ? errors.confirmPassword
                : false
            }
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Grid item xs={12}>
            <FormControl
              required
              error={errors.checked && touched.checked ? errors.checked : false}
              component="fieldset"
              className={classes.formControl}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value="allowExtraEmails"
                    color="primary"
                    checked={values.checked}
                    onChange={() => {
                      setFieldValue('checked', !values.checked)
                    }}
                  />
                }
                label={t(`${breadcrumb}.IATTTAC`)}
              />
              {errors.checked && touched.checked ? (
                <FormHelperText>{errors.checked}</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={isSubmitting}
        >
          {t(`${breadcrumb}.Register`)}
        </Button>
        <Grid container>
          <Grid item xs />
          <Grid item>
            <Link
              variant="body2"
              onClick={() => {
                handleChangeTabIndex(0)
                resetForm()
                // push('/register')
              }}
            >
              {t(`${breadcrumb}.AHACSI`)}
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </form>
    </div>
  )
}
