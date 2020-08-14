import React from 'react'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { IconButton, makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

const VariantEnum = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

const useStyles = makeStyles((theme) => ({}))

export function useApi(url) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const token = localStorage.getItem('access-token')

  const api = axios.create({
    baseURL: url,
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // declare a request interceptor
  api.interceptors.request.use(
    (config) => {
      // perform a task before the request is sent
      // console.log('Request was sent')

      return config
    },
    (error) => {
      // handle the error
      return Promise.reject(error)
    }
  )

  // declare a response interceptor
  api.interceptors.response.use(
    (response) => {
      // do something with the response data
      // console.log('Response was received')

      return response
    },
    (error) => {
      if (error.code === 'ECONNABORTED') {
        // console.log(`A timeout happend on url ${error.config.url}`)
        enqueueSnackbar('Request timeout', {
          variant: VariantEnum.ERROR,
          action: (key) => (
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          )
        })
      }
      // handle the response error
      return Promise.reject(error)
    }
  )

  const onGet = async (data = {}) => {
    try {
      const response = await api.get('/', data)
      enqueueSnackbar('Successful', {
        variant: VariantEnum.SUCCESS,
        action: (key) => (
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={() => closeSnackbar(key)}
          >
            <CloseIcon style={{ color: '#fff' }} />
          </IconButton>
        )
      })
      return response.data
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log('Response', error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        enqueueSnackbar(error.response.data.message, {
          variant: VariantEnum.ERROR,
          action: (key) => (
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          )
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log('Request', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Message', error.message)
      }
      // console.log('Config', error.config)
    }
  }

  const onPost = async (data) => {
    try {
      const response = await api.post(url, data)
      enqueueSnackbar('Successful', {
        variant: VariantEnum.SUCCESS,
        action: (key) => (
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={() => closeSnackbar(key)}
          >
            <CloseIcon style={{ color: '#fff' }} />
          </IconButton>
        )
      })
      return response.data
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log('Response', error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        enqueueSnackbar(error.response.data.message, {
          variant: VariantEnum.ERROR,
          action: (key) => (
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          )
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log('Request', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Message', error.message)
      }
      // console.log('Config', error.config)
    }
  }

  const onPut = async (id, data) => {
    try {
      const response = await api.put(`/${id}`, data)
      enqueueSnackbar('Successful', {
        variant: VariantEnum.SUCCESS,
        action: (key) => (
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={() => closeSnackbar(key)}
          >
            <CloseIcon style={{ color: '#fff' }} />
          </IconButton>
        )
      })
      return response.data
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log('Response', error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        enqueueSnackbar(error.response.data.message, {
          variant: VariantEnum.ERROR,
          action: (key) => (
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          )
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log('Request', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Message', error.message)
      }
      // console.log('Config', error.config)
    }
  }

  const onDelete = async (id) => {
    try {
      const response = await api.delete(`/${id}`)
      enqueueSnackbar('Successful', {
        variant: VariantEnum.SUCCESS,
        action: (key) => (
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label="search"
            onClick={() => closeSnackbar(key)}
          >
            <CloseIcon style={{ color: '#fff' }} />
          </IconButton>
        )
      })
      return response.data
    } catch (error) {
      // console.log(error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log('Response', error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        enqueueSnackbar(error.response.data.message, {
          variant: VariantEnum.ERROR,
          action: (key) => (
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={() => closeSnackbar(key)}
            >
              <CloseIcon style={{ color: '#fff' }} />
            </IconButton>
          )
        })
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log('Request', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Message', error.message)
      }
      // console.log('Config', error.config)
    }
  }

  return {
    onGet,
    onPost,
    onPut,
    onDelete
  }
}
