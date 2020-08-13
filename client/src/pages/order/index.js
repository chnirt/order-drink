import React, { useState, useEffect } from 'react'
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
import axios from 'axios'

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
  }
}))

export default function Order() {
  const classes = useStyles()
  let { invitationId } = useParams()
  const { pathname, search } = useLocation()

  const [brandName, setBrandName] = useState('')
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])

  const token = localStorage.getItem('access-token')

  useEffect(() => {
    onRequest()
    // const currentPath = pathname
    // const searchParams = new URLSearchParams(search)
    // console.log( brandName, currentPath, searchParams)
  }, [brandName, pathname, search])

  function onRequest() {
    axios
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
      .catch((err) => console.log(err))
    axios
      .get(`${variable.url}/invitations/${invitationId}/report`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const orders = res?.data?.[0].orders
        setOrders(orders)
      })
      .catch((err) => console.log(err))
  }

  function onCart(name) {
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
        // console.log('order', res.data)
      })
      .catch((err) => console.log(err))
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
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() => onCart(element?.name)}
                            >
                              <LocalBarOutlinedIcon />
                            </IconButton>
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
    </div>
  )
}
