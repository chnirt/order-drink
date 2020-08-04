import React, { Fragment } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
  List,
  ListItem,
  colors,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// import { useTheme } from '../../../../../../context/useTheme'

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}))

// const CustomRouterLink = forwardRef((props, ref) => (
//   <div ref={ref} style={{ flexGrow: 1 }}>
//     <RouterLink {...props} />
//   </div>
// ))

const breadcrumb = 'src.layouts.Main.components.Sidebar.components.SildebarNav'

const SidebarNav = ({
  pages,
  className,
  onClose,
  selectedIndex,
  handleListItemClick,
  ...rest
}) => {
  const classes = useStyles()
  let { push } = useHistory()
  const { t } = useTranslation()
  // const { main } = useTheme()

  const [open, setOpen] = React.useState(false)

  const handleSub = () => {
    setOpen(!open)
  }

  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages?.map((page, i) => {
        if (page?.pages?.length > 0) {
          return (
            <Fragment key={i}>
              <ListItem
                button
                key={i}
                selected={selectedIndex === i}
                onClick={handleSub}
              >
                <ListItemIcon>{page.icon}</ListItemIcon>
                <ListItemText primary="Inbox" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {page?.pages?.map((page, idx) => (
                    <ListItem
                      button
                      key={idx}
                      className={classes.nested}
                      // selected={selectedIndex === page.href}
                      onClick={event => {
                        handleListItemClick(event, i)
                        setOpen(false)
                        // push(page.href)
                        onClose()
                      }}
                    >
                      <ListItemIcon
                        style={
                          {
                            // color: main
                          }
                        }
                      >
                        {page.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={t(`${breadcrumb}.${page.title}`)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Fragment>
          )
        }
        return (
          <ListItem
            button
            key={i}
            selected={selectedIndex === page.href}
            onClick={event => {
              handleListItemClick(event, i, page.href)
              push(page.href)
              onClose()
            }}
          >
            <ListItemIcon
              style={
                {
                  // color: main
                }
              }
            >
              {page.icon}
            </ListItemIcon>
            <ListItemText primary={t(`${breadcrumb}.${page.title}`)} />
          </ListItem>
        )
      })}
    </List>
  )
}

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
}

export default SidebarNav
