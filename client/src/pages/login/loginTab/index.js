import React from 'react'
import {
  makeStyles,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Box
} from '@material-ui/core'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import Logo from '../../../assets/images/logo.png'
import WhiteLogo from '../../../assets/images/whitelogo.png'
import Copyright from '../../../components/Copyright'
import { loginSchema } from '../../../validation/loginSchema'
import { useAuth } from '../../../context/useAuth'
import { useCustomTheme } from '../../../context/useCustomTheme'

const useStyles = makeStyles((theme) => ({
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

export default function LoginTab({ setOpen, handleChangeTabIndex }) {
  const classes = useStyles()
  let { login } = useAuth()
  let { replace } = useHistory()
  let { state } = useLocation()
  const { darkState } = useCustomTheme()
  const { t } = useTranslation()

  let { from } = state || { from: { pathname: '/' } }

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    resetForm
  } = useFormik({
    initialValues: {
      username: 'chnirt',
      password: '0'
      // username: '',
      // password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      setOpen(true)
      const result = await login(values.username, values.password)

      if (result) {
        resetForm()
        replace(from)
      }
      setOpen(false)
    }
  })

  // function handleBlur(formikBlur, event) {
  //   if (!(field.value.length > 0)) {
  //     onFocus(false)
  //   }
  //   formikBlur(event)
  // }

  return (
    <div className={classes.paper}>
      <Avatar
        variant="square"
        className={classes.avatar}
        src={darkState ? WhiteLogo : Logo}
      />
      <Typography component="h1" variant="h5">
        {t(`${breadcrumb}.LoginPage`)}
      </Typography>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={isSubmitting}
        >
          {t(`${breadcrumb}.Login`)}
        </Button>
        <Grid container>
          <Grid item xs>
            {/* <Link
            variant="body2"
            onClick={() => {
              handleChangeTabIndex(1)
              resetForm()
              // push('/register')
            }}
          >
            {t(`${breadcrumb}.ForgotPassword`)}
          </Link> */}
          </Grid>
          <Grid item>
            <Link
              variant="body2"
              onClick={() => {
                handleChangeTabIndex(1)
                resetForm()
              }}
            >
              {t(`${breadcrumb}.DHAASU`)}
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
