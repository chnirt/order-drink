import React from 'react'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { useTranslation } from 'react-i18next'

export default function Copyright() {
  const { t } = useTranslation()
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {t('src.components.Copyright.CopyRight') + ' © '}
      <Link color="inherit" href="https://github.com/chnirt">
        Chnirt
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}
