import React from 'react'
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'
import FastfoodOutlinedIcon from '@material-ui/icons/FastfoodOutlined'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
// import TouchAppIcon from '@material-ui/icons/TouchApp'
// import WifiIcon from '@material-ui/icons/Wifi'
// import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
// import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
// import AnnouncementIcon from '@material-ui/icons/Announcement'
// import ViewCarouselIcon from '@material-ui/icons/ViewCarousel'
// import CodeIcon from '@material-ui/icons/Code'
// import NotesIcon from '@material-ui/icons/Notes'
// import HelpIcon from '@material-ui/icons/Help'
// import LanguageIcon from '@material-ui/icons/Language'
// import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
// import CropFreeIcon from '@material-ui/icons/CropFree'
// import ImageIcon from '@material-ui/icons/Image'
// import SettingsIcon from '@material-ui/icons/Settings'
// import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'

export const pages = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <DashboardOutlinedIcon />
  },
  {
    title: 'TodayWhoOffer',
    href: '/todaywhooffer',
    icon: <FastfoodOutlinedIcon />
  },
  {
    title: 'Invitation',
    href: '/invitation',
    icon: <LocalOfferOutlinedIcon />
  }
]
