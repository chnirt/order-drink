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
    timeout: 5000,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const refresh = () => {
    console.log('REFRESH:')
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
                // cache[url] = r.data // set response in cache;
                setData(r.data)
              }
            })
            .catch((error) => {
              if (error.response) {
                setError(error.response?.data)
              } else {
                setError(error.message)
              }
            })
            .finally(() => setLoading(false))
        }
      }

      fetchDate()
    }
    return () => {
      cancelled = true
    }
  }, [skip, refreshIndex])

  const onPost = (params, config) => {
    console.log('POST:')
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
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
      .finally(() => setLoading(false))
  }

  const onGet = (id) => {
    console.log('GET:')
    setLoading(true)
    return new Promise((resolve, reject) => {
      api
        .get(`/${id}`)
        .then((r) => {
          if (r.status === 200) {
            resolve(r.data)
          }
        })
        .catch((error) => {
          reject(error.response?.data)
        })
        .finally(() => setLoading(false))
    })
  }

  const onPut = (id, params) => {
    console.log('PUT:')
    setLoading(true)
    api
      .put(`/${id}`, params)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
      .finally(() => setLoading(false))
  }

  const onPatch = (id, params) => {
    console.log('PATCH:')
    setLoading(true)
    api
      .patch(`/${id}`, params)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
      .finally(() => setLoading(false))
  }

  const onDelete = (id) => {
    console.log('DELETE:')
    setLoading(true)
    api
      .delete(`/${id}`)
      .then((r) => {
        if (r.status === 200) {
          refresh()
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response?.data)
        } else {
          setError(error.message)
        }
      })
      .finally(() => setLoading(false))
  }

  return {
    data,
    setData,
    loading,
    error,
    refresh,
    onGet,
    onPost,
    onPut,
    onPatch,
    onDelete
  }
}
