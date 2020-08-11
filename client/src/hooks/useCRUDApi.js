import { useState, useEffect } from 'react'
import axios from 'axios'

const cache = {}

export function useCRUDApi(url, skip, config) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [refreshIndex, setRefreshIndex] = useState(0)

  const token = localStorage.getItem('access-token')

  const api = axios.create({
    baseURL: url,
    timeout: 2500,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const refresh = () => {
    delete cache[url]
    setRefreshIndex(refreshIndex + 1)
  }

  useEffect(() => {
    let cancelled = false
    if (skip) {
      setData(null)
      setLoading(false)
    } else {
      const fetchDate = async () => {
        setLoading(true)
        console.log('Asd', cache[url])
        if (cache[url]) {
          const data = cache[url]
          setData(data)
          setLoading(false)
        } else {
          api
            .get('/', {
              ...config,
              transformResponse: [
                (data) => config.responseDTO(JSON.parse(data))
              ]
            })
            .then((r) => {
              if (!cancelled) {
                // console.log(r.data)
                cache[url] = r.data // set response in cache;
                setData(r.data)
                setLoading(false)
              }
            })
            .catch((error) => {
              setLoading(false)
              if (error.response) {
                setError(error.response?.data)
              } else {
                setError(error.message)
              }
            })
        }
      }

      fetchDate()
    }
    return () => {
      cancelled = true
    }
  }, [skip, refreshIndex])

  const onPost = (params, config) => {
    setLoading(true)
    api
      .post(url, params, {
        ...config,
        transformRequest: [
          (data, headers) => {
            // modify data here
            return config.requestDTO(data)
          },
          ...api.defaults.transformRequest
        ]
      })
      .then((r) => {
        if (r.status === 201) {
          refresh()
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
  }

  const onGet = (id) => {
    setLoading(true)
    return new Promise((resolve, reject) => {
      api
        .get(`/${id}`)
        .then((r) => {
          if (r.status === 200) {
            setLoading(false)
            resolve(r.data)
          }
        })
        .catch((error) => {
          setLoading(false)
          reject(error.response?.data)
        })
    })
  }

  const onPut = (id, params) => {
    setLoading(true)
    api
      .put(`/${id}`, params)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
  }

  const onPatch = (id, params) => {
    setLoading(true)
    api
      .patch(`/${id}`, params)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
  }

  const onDelete = (id) => {
    setLoading(true)
    api
      .delete(`/${id}`)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        setLoading(false)
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
  }

  return {
    data,
    loading,
    error,
    refresh,
    setData,
    onGet,
    onPost,
    onPut,
    onPatch,
    onDelete
  }
}
