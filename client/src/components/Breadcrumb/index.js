import React from 'react'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

export default function BreadCrumbs({ basename = '', path = '' }) {
  const { t } = useTranslation()

  const pathList = `${basename}${path}`.split('/')

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {pathList.map((element, i) => {
        const capitalize = capitalizeFirstLetter(element)
        if (i === pathList.length - 1) {
          return (
            <Typography key={i} color="textPrimary">
              {t(`src.components.Breadcrumb.${capitalize}`)}
            </Typography>
          )
        }
        return (
          <Link
            key={i}
            to={`/${element}`}
            style={{
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {t(`src.components.Breadcrumb.${capitalize}`)}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
