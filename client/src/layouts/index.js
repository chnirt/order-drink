import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useMediaQuery, AppBar, CssBaseline } from '@material-ui/core'
import { useLocation } from 'react-router-dom'

import { Sidebar, Topbar, Footer, Drawer } from './Main/components'

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  shiftContent: {
    paddingLeft: 240
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },

  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    // flexGrow: 1,
    height: '100%'
    // overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  },
  fab: {
    position: 'absolute',
    border: 2,
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  drawer: {
    [theme.breakpoints.up('xs')]: {
      width: '100vw'
    },
    [theme.breakpoints.up('sm')]: {
      width: '50vw'
    },
    [theme.breakpoints.up('md')]: {
      width: '25vw'
    }
  },
  childrenContainer: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    minHeight: 'calc(100vh - 173px)'
  }
}))

const Main = ({ children }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })
  const { pathname } = useLocation()

  const [openSidebar, setOpenSidebar] = useState(false)

  const handleSidebarOpen = () => {
    setOpenSidebar(true)
  }

  const handleSidebarClose = () => {
    setOpenSidebar(false)
  }

  const shouldOpenSidebar = isDesktop ? true : openSidebar

  const [selectedIndex, setSelectedIndex] = useState(pathname)

  const handleListItemClick = (event, index, href) => {
    // console.log(selectedIndex)
    // console.log(event, index, href, pathname)
    setSelectedIndex(href)
  }

  const [open, setOpen] = useState(false)

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <CssBaseline />
      <AppBar position="absolute" className={classes.appBar}>
        <Topbar onSidebarOpen={handleSidebarOpen} {...{ setOpen }} />
      </AppBar>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
        selectedIndex={selectedIndex}
        handleListItemClick={handleListItemClick}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.childrenContainer}>{children}</div>
        <Footer />
      </main>
      <Drawer {...{ open, setOpen }} />
    </div>
  )
}

Main.propTypes = {
  children: PropTypes.node
}

export default Main
