import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useParams, useLocation } from 'react-router-dom'
import {
  Grid,
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton
} from '@material-ui/core'
import LocalBarOutlinedIcon from '@material-ui/icons/LocalBarOutlined'
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined'
import axios from 'axios'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import socket from 'socket.io-client'

import { variable } from '../../constants'
import Breadcrumb from '../../components/Breadcrumb'
import Report from './report'

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    padding: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  root: {
    overflow: 'auto',
    maxHeight: 'calc(100vh - 249px)'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

export default function Order() {
  const classes = useStyles()
  let { invitationId } = useParams()
  const { pathname, search } = useLocation()

  const [brandName, setBrandName] = useState('')
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [myOrder, setMyOrder] = useState({})
  const socketRef = useRef()

  const token = localStorage.getItem('access-token')

  useEffect(() => {
    let isCancelled = false

    const runAsync = async () => {
      try {
        if (!isCancelled) {
          socketRef.current = socket.connect(variable.url)

          socketRef.current.emit('joined room', invitationId)

          // socketRef.current.on('allMessages', (data) => {
          //   console.log(data)
          //   setMessages((s) => [...data, ...s])
          // })

          socketRef.current.on('joined room', (data) => {
            console.log('joined room:', data)
          })

          socketRef.current.on('report', (data) => {
            console.log('report: ', data)
            const orders = data?.[0].orders
            setOrders(orders)
          })
        }
      } catch (e) {
        if (!isCancelled) {
          throw e
        }
      }
    }

    runAsync()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    onRequest()
    // const currentPath = pathname
    // const searchParams = new URLSearchParams(search)
    // console.log( brandName, currentPath, searchParams)
  }, [brandName, pathname, search])

  function onRequest() {
    setLoading(true)
    const promise1 = axios
      .get(`${variable.url}/invitations/${invitationId}/menu`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const brand_name = res?.data?.reply?.delivery_detail?.brand?.name
        const menu_infos = res?.data?.reply?.menu_infos
        setBrandName(brand_name)
        setMenu(menu_infos)
      })
    const promise2 = axios
      .get(`${variable.url}/invitations/${invitationId}/report`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const orders = res?.data?.[0].orders
        setOrders(orders)
      })
    const promise3 = axios
      .get(`${variable.url}/orders`, {
        params: { mine: true, invitationId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const myOrder = res?.data?.[0]
        setMyOrder(myOrder)
      })
    Promise.all([promise1, promise2, promise3])
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  function addOrder(name) {
    setLoading(true)
    axios
      .post(
        `${variable.url}/orders`,
        {
          dishId: name,
          invitation: invitationId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then((res) => {
        setMyOrder(res.data)
        socketRef.current.emit('sendCart', {
          roomId: invitationId,
          data: name
        })
      })
      .catch((err) => console.log('ERROR:', err))
      .finally(() => setLoading(false))
  }

  async function deleteOrder(id) {
    setLoading(true)
    const response = await axios.get(`${variable.url}/orders`, {
      params: { mine: true, invitationId, dishId: id },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200 && response.data) {
      const _id = response.data[0]._id

      axios
        .delete(`${variable.url}/orders/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          setMyOrder({})
          socketRef.current.emit('sendCart', {
            roomId: invitationId,
            data: id
          })
        })
        .catch((err) => console.log('ERROR:', err))
        .finally(() => setLoading(false))
    }
  }

  return (
    <div>
      <div className={classes.breadcrumb}>
        <Breadcrumb basename="Dashboard" path={pathname} />
      </div>

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <List
              className={classes.root}
              subheader={<li style={{ backgroundColor: '#fff' }} />}
              button="true"
            >
              {menu?.map((element, i) => {
                return (
                  <li key={i}>
                    <ul className={classes.ul}>
                      <ListSubheader>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            width: '200px',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {element?.dish_type_name}
                        </span>
                      </ListSubheader>
                      {element?.dishes?.map((element, i) => (
                        <ListItem key={i}>
                          <ListItemAvatar>
                            <Avatar
                              alt={element?.photos[4]?.value}
                              src={element?.photos[4]?.value}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            id={element?.name}
                            primary={element?.name}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  className={classes.inline}
                                  color="textPrimary"
                                >
                                  {element?.price?.value} VND
                                </Typography>
                                {` — ${element?.description}`}
                              </React.Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            {myOrder?.dishId === element?.name ? (
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => deleteOrder(element?.name)}
                              >
                                <DeleteForeverOutlinedIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                edge="end"
                                aria-label="comments"
                                onClick={() => addOrder(element?.name)}
                              >
                                <LocalBarOutlinedIcon />
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </ul>
                  </li>
                )
              })}
            </List>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Report orders={orders} />
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
