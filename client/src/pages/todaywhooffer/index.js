import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  InputBase,
  Typography,
  useTheme
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import RoomServiceOutlinedIcon from '@material-ui/icons/RoomServiceOutlined'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'

import Breadcrumb from '../../components/Breadcrumb'
import { useCustomTheme } from '../../context/useCustomTheme'
import { formatNameWithMaterial } from '../../utils/firstCharacterOfEachString'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'
import { invitationsResponse } from '../../dto/invitation'
import { variable } from '../../constants'
import { useCRUDApi } from '../../hooks/useCRUDApi'
import MyBackdrop from '../../components/MyBackdrop'
import { useSocket } from '../../context/useSocket'

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    padding: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  root: {
    display: 'flex'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.colors.white, 0.15),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      // backgroundColor: fade(theme.palette.common.white, 0.25),
      backgroundColor: 'rgba(255, 255, 255, 0.25)'
    },
    marginBottom: theme.spacing(1),
    // marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      // marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },
  media: {
    width: 100,
    height: 100
    // paddingTop: '56.25%', // 16:9
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

// const listoffer = [
//   {
//     coupon: 'ZHW2O9',
//     name: 'S1',
//     reason: 'Lanh luong',
//     status: 'unpublish',
//     image:
//       'https://cafefcdn.com/thumb_w/650/2019/7/7/phuc-long-mo-2-chi-nhanh-o-hang-dieu-va-vincom-lam-fan-ha-noi-dung-ngoi-khong-yen-b488c401636887600391620970-1562468064186162036512-crop-15625496664651414098330.jpg',
//     avatar:
//       'https://gamek.mediacdn.vn/k:2015/11-1441712323241/hot-girl-thich-choi-dota-2-gay-sot-cong-dong-game-thu-viet.jpg'
//   },
//   {
//     coupon: 'ZHW123',
//     name: 'S2',
//     reason: 'Hu roi',
//     status: 'locked',
//     image:
//       'https://cafefcdn.com/thumb_w/650/2019/7/7/phuc-long-mo-2-chi-nhanh-o-hang-dieu-va-vincom-lam-fan-ha-noi-dung-ngoi-khong-yen-b488c401636887600391620970-1562468064186162036512-crop-15625496664651414098330.jpg',
//     avatar: 'https://file.tinnhac.com/resize/600x-/2016/08/03/IU2-ff31.jpg'
//   },
//   {
//     coupon: '10ZH32',
//     name: 'Trinh Chin Chin Chin',
//     reason: 'Chin moi nuoc',
//     status: 'published',
//     image:
//       'https://images.foody.vn/res/g97/966583/prof/s1242x600/foody-upload-api-foody-mobile-28168540_15906390443-191009142526.jpg'
//   },
//   {
//     coupon: 'ZMAW1K',
//     name: 'Trinh Chin Chin Chin',
//     reason: 'Chin thich moi',
//     status: 'complete',
//     image:
//       'https://images.foody.vn/res/g97/966583/prof/s1242x600/foody-upload-api-foody-mobile-28168540_15906390443-191009142526.jpg'
//   }
// ]

const breadcrumb = 'src.pages.todaywhooffer'

export default function TodayWhoOffer() {
  const classes = useStyles()
  const { t } = useTranslation()
  const { main } = useCustomTheme()
  const theme = useTheme()
  const { pathname } = useLocation()
  let { push } = useHistory()
  let {
    data,
    loading: loadingInvitation,
    refresh: refreshInvitation
  } = useCRUDApi(`${variable.url}/invitations`, null, {
    params: { isPublic: true, sortBy: '-createdAt' },
    responseDTO: invitationsResponse
  })
  const { socketOn } = useSocket()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    socketOn('onChangeInvitation', (data) => {
      if (data) {
        console.log('true')
        refreshInvitation()
      }
      console.log('false')
    })
  }, [])

  async function handleJoinInvitation(element) {
    const { id } = element
    const token = localStorage.getItem('access-token')
    setLoading(true)
    try {
      const response = await axios.post(
        `${variable.url}/invitations/${id}/join`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data) {
        setLoading(false)
        push(`/order/${id}`)

        // enqueueSnackbar('Successful', {
        //   variant: VariantEnum.SUCCESS,
        //   action: (key) => (
        //     <IconButton
        //       type="submit"
        //       className={classes.iconButton}
        //       aria-label="search"
        //       onClick={() => closeSnackbar(key)}
        //     >
        //       <CloseIcon style={{ color: '#fff' }} />
        //     </IconButton>
        //   )
        // })
      }

      return response.data
    } catch (error) {
      setLoading(false)
      // console.log(error)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log('Response', error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        if (error.response.data.message === 'You joined') {
          push(`/order/${id}`)
        }
        // enqueueSnackbar(error.response.data.message, {
        //   variant: VariantEnum.ERROR,
        //   action: (key) => (
        //     <IconButton
        //       type="submit"
        //       className={classes.iconButton}
        //       aria-label="search"
        //       onClick={() => closeSnackbar(key)}
        //     >
        //       <CloseIcon style={{ color: '#fff' }} />
        //     </IconButton>
        //   )
        // })
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

  return (
    <div>
      <div className={classes.breadcrumb}>
        <Breadcrumb basename="Dashboard" path={pathname} />
      </div>

      <div className={classes.content}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder={t(`${breadcrumb}.Coupon`)}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>

        {/* <button
          onClick={() => {
            refreshInvitation()
          }}
        >
          refersh
        </button> */}

        <div style={{ display: 'flex', paddingTop: 10 }}>
          <Grid container spacing={3}>
            {data?.map((element, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <Card style={{ display: 'flex' }}>
                  <CardMedia
                    className={classes.media}
                    image={element.image}
                    title="Paella dish"
                  />
                  <CardHeader
                    style={{
                      flex: 1,
                      justifyContent: 'space-between',
                      alignSelf: 'center'
                    }}
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        style={{
                          color: theme.palette.getContrastText(main)
                          // backgroundColor: main
                        }}
                        src={element.avatar}
                      >
                        <Typography>
                          {formatNameWithMaterial(
                            capitalizeFirstLetter(element.invitor.username)
                          )}
                        </Typography>
                      </Avatar>
                    }
                    action={
                      <IconButton
                        aria-label="settings"
                        style={
                          {
                            // color: main
                          }
                        }
                        onClick={() => handleJoinInvitation(element)}
                      >
                        <RoomServiceOutlinedIcon />
                      </IconButton>
                    }
                    title={element.reason}
                    subheader={moment(element.createdAt).format(
                      'HH:mm DD/MM/YYYY'
                    )}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <MyBackdrop open={loadingInvitation || loading} />
      {/* <Backdrop
        className={classes.backdrop}
        open={loadingInvitation || loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </div>
  )
}
