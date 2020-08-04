import React from 'react'
import { makeStyles } from '@material-ui/styles'

import Breadcrumb from '../../components/Breadcrumb'

const useStyles = makeStyles(theme => ({
  breadcrumb: {
    padding: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}))

export default function Dashboard() {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.breadcrumb}>
        <Breadcrumb basename="Dashboard" />
      </div>

      <div className={classes.content}>Dashboard</div>
    </div>
  )
}
