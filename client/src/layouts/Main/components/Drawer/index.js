import React from 'react'
import {
  SwipeableDrawer,
  Radio,
  withStyles,
  colors,
  makeStyles,
  IconButton,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  MenuItem,
  InputBase,
  Select
} from '@material-ui/core'
import clsx from 'clsx'
import CloseIcon from '@material-ui/icons/Close'
import NightsStayOutlinedIcon from '@material-ui/icons/NightsStayOutlined'
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined'
import LanguageOutlinedIcon from '@material-ui/icons/LanguageOutlined'
import { useTranslation } from 'react-i18next'

import { useCustomTheme } from '../../../../context/useCustomTheme'
import { useI18n } from '../../../../context/useI18n'
import { variable } from '../../../../constants'

const { shade } = variable

const useStyles = makeStyles(theme => ({
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
  }
}))

const CustomRadio = withStyles({
  root: {
    color: ({ value }) => colors[value][shade],
    '&$checked': {
      color: ({ value }) => colors[value][shade]
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />)

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase)

export default function Drawer({ open, setOpen }) {
  const classes = useStyles()
  const {
    darkState,
    toggleDarkMode,
    colorList,
    mainColor,
    handleMainColor
  } = useCustomTheme()
  let { language, changeLanguage } = useI18n()
  const { t } = useTranslation()

  return (
    <SwipeableDrawer
      anchor={'right'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      classes={{
        paper: classes.drawer
      }}
    >
      <div
        className={clsx(classes.list, {
          [classes.fullList]: false
        })}
        role="presentation"
      >
        <IconButton onClick={() => setOpen(false)} color="inherit">
          <CloseIcon fontSize="small" />
        </IconButton>
        <List
          subheader={
            <ListSubheader>
              {t('src.layouts.Main.components.Drawer.Setting')}
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemIcon>
              <PaletteOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-wifi"
              primary={t('src.layouts.Main.components.Drawer.Theme')}
            />
          </ListItem>
          <div style={{ padding: '8px 16px' }}>
            {colorList?.map((item, i) => (
              <CustomRadio
                key={i}
                checked={mainColor === item}
                onChange={e => handleMainColor(e.target.value)}
                value={item}
                name="radio-button-demo"
              />
            ))}
          </div>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <NightsStayOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-wifi"
              primary={t('src.layouts.Main.components.Drawer.DarkMode')}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={darkState}
                onChange={toggleDarkMode}
                inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <LanguageOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              id="switch-list-label-wifi"
              primary={t('src.layouts.Main.components.Drawer.Language')}
            />

            <ListItemSecondaryAction>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
                value={language}
                onChange={e => changeLanguage(e.target.value)}
                input={<BootstrapInput />}
              >
                <MenuItem value={'en'}>
                  <span role="img" aria-label="english">
                    🇺🇸
                  </span>
                </MenuItem>
                <MenuItem value={'vi'}>
                  <span role="img" aria-label="vietnamese">
                    🇻🇳
                  </span>
                </MenuItem>
              </Select>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
    </SwipeableDrawer>
  )
}
