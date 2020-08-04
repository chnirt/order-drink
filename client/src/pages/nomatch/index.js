import React, { Fragment } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NoMatch() {
  let { pathname, state } = useLocation()
  let { replace } = useHistory()

  const { t } = useTranslation()
  let { from } = state || { from: { pathname: '/' } }

  function onBack() {
    replace(from)
  }

  return (
    <Fragment>
      <h3>
        {t('No match for')} <code>{pathname}</code>
        <br />
        <button onClick={onBack}>{t('Back')}</button>
      </h3>
    </Fragment>
  )
}
