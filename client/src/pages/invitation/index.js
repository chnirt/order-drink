import React, { useState, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import { makeStyles } from '@material-ui/styles'
import MaterialTable from 'material-table'
import AddOutlinedIcon from '@material-ui/icons/AddOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import { useTranslation } from 'react-i18next'
import {
  Chip,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'

// import AccountsDetail from '../accountsDetail'
import Breadcrumb from '../../components/Breadcrumb'
import ScrollDialog from '../../components/ScrollDialog'
import { useCustomTheme } from '../../context/useCustomTheme'
import { createInvitationSchema } from '../../validation/createInvitationSchema'
import { nanoId } from '../../utils/nanoId'
import { useCRUDApi } from '../../hooks/useCRUDApi'
import { invitationsResponse, invitationRequest } from '../../dto/invitation'
import { variable } from '../../constants'

const useStyles = makeStyles((theme) => ({
  breadcrumb: {
    padding: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}))

const breadcrumb = 'src.pages.invitation'

export default function Invitation(props) {
  const classes = useStyles()
  const { t } = useTranslation()
  const { getColor } = useCustomTheme()
  const { pathname } = useLocation()
  let {
    data,
    loading: loadingInvitation,
    onGet,
    onPost,
    onPatch,
    onDelete
  } = useCRUDApi(`${variable.url}/invitations`, false, {
    params: { mine: true, sortBy: '-createdAt' },
    responseDTO: invitationsResponse
  })

  const [action, setAction] = useState(null)
  const [id, setId] = useState(null)

  const columns = [
    {
      title: t(`${breadcrumb}.Coupon`),
      field: 'coupon'
    },
    {
      title: t(`${breadcrumb}.Reason`),
      field: 'reason'
    },
    {
      title: t(`${breadcrumb}.Menu`),
      field: 'menuId',
      lookup: {
        'phuc-long': 'phuc-long',
        'go-cafe': 'go-cafe',
        highlands: 'highlands'
      },
      render: (rowData) => {
        const formatColorStatus = (menuId) => {
          switch (menuId) {
            case 'go-cafe':
              return getColor('brown')
            case 'highlands':
              return getColor('red')
            default:
              return getColor('green')
          }
        }
        return (
          <Chip
            style={{ backgroundColor: formatColorStatus(rowData.menuId) }}
            color="primary"
            label={rowData.menuId}
          />
        )
      }
    },
    {
      title: t(`${breadcrumb}.Public`),
      field: 'isPublic'
    }
  ]

  // const [data, setData] = React.useState([
  //   { id: 1, coupon: 'ZHW2O9', reason: 'Lanh luong', status: 'unpublish' },
  //   { id: 2, coupon: 'ZHW123', reason: 'Hu roi', status: 'locked' },
  //   {
  //     id: 3,
  //     coupon: '10ZH32',
  //     reason: 'Chin moi nuoc',
  //     status: 'published'
  //   },
  //   {
  //     id: 4,
  //     coupon: 'ZMAW1K',
  //     reason: 'Chin thich moi',
  //     status: 'complete'
  //   }
  // ])

  const [open, setOpen] = useState(false)

  function onOpen(action) {
    setAction(action)
    setOpen(true)
  }

  function onClose() {
    setOpen(false)
    setId(null)
    resetForm()
  }

  function handleCreate() {
    handleSubmit()
  }

  async function handleUpdate() {
    handleSubmit()
  }

  function handleDelete() {
    onDelete(id)
    onClose()
  }

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    resetForm,
    setFieldValue
  } = useFormik({
    initialValues: {
      coupon: nanoId(),
      reason: '',
      menuId: '',
      isPublic: false
    },
    validationSchema: createInvitationSchema,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2))
      if (id) {
        onPatch(id, values)
      } else {
        onPost(values, {
          requestDTO: invitationRequest
        })
      }
      onClose()
    }
  })

  return (
    <div>
      <div className={classes.breadcrumb}>
        <Breadcrumb basename="Dashboard" path={pathname}>
          {t(`${breadcrumb}.Invitation`)}
        </Breadcrumb>
      </div>

      <div className={classes.content}>
        <MaterialTable
          title={t(`${breadcrumb}.InvitationList`)}
          columns={columns}
          data={data}
          isLoading={loadingInvitation}
          // data={query =>
          //   new Promise((resolve, reject) => {
          //     let url = 'https://reqres.in/api/users?'
          //     url += 'per_page=' + query.pageSize
          //     url += '&page=' + (query.page + 1)
          //     fetch(url)
          //       .then(response => response.json())
          //       .then(result => {
          //         resolve({
          //           data: result.data,
          //           page: result.page - 1,
          //           totalCount: result.total,
          //         })
          //       })
          //   })
          // }
          options={{
            filtering: true,
            actionsColumnIndex: -1,
            grouping: true,
            // search: true,
            // sorting: true,
            fixedColumns: {
              // left: 2,
              // right: 1
            },
            pageSize: 5,
            pageSizeOptions: [5, 10]
          }}
          actions={[
            {
              // icon: 'add',
              icon: () => <AddOutlinedIcon />,
              tooltip: t(`${breadcrumb}.CreateInvitation`),
              isFreeAction: true,
              onClick: (event) => {
                onOpen('create')
              }
            },
            (rowData) => ({
              // icon: 'edit',
              icon: () => <EditOutlinedIcon />,
              tooltip: t(`${breadcrumb}.UpdateInvitation`),
              onClick: async (event, rowData) => {
                // alert('You want to update ' + rowData.name)
                // push(`/order/${rowData.coupon}`)

                // console.log(rowData)
                const invitation = await onGet(rowData.id)
                setFieldValue('coupon', invitation.coupon)
                setFieldValue('reason', invitation.reason)
                setFieldValue('menuId', invitation.menuId)
                setFieldValue('isPublic', invitation.isPublic)
                setId(rowData.id)
                onOpen('update')
              }
            }),
            (rowData) => ({
              // icon: 'delete',
              icon: () => <DeleteOutlinedIcon />,
              tooltip: t(`${breadcrumb}.DeleteInvitation`),
              onClick: (event, rowData) => {
                // alert('You want to delete ' + rowData.name)
                setId(rowData.id)
                onOpen('delete')
                // onOpenDelete(rowData.id)
              }
            })
            // {
            //   // icon: 'isPublic',
            //   icon: () => <PublishOutlinedIcon />,
            //   tooltip: 'Publish Invitation',
            //   onClick: (event, rowData) =>
            //     alert('You published ' + rowData.name)
            // }
          ]}
          editable={
            {
              // onRowAdd: newData =>
              //   new Promise(resolve => {
              //     setTimeout(() => {
              //       resolve()
              //       setState(prevState => {
              //         const data = [...prevState.data]
              //         data.push(newData)
              //         return { ...prevState, data }
              //       })
              //     }, 600)
              //   }),
              // onRowUpdate: (newData, oldData) =>
              //   new Promise(resolve => {
              //     setTimeout(() => {
              //       resolve()
              //       if (oldData) {
              //         setState(prevState => {
              //           const data = [...prevState.data]
              //           data[data.indexOf(oldData)] = newData
              //           return { ...prevState, data }
              //         })
              //       }
              //     }, 600)
              //   })
              // onRowDelete: oldData =>
              //   new Promise(resolve => {
              //     setTimeout(() => {
              //       resolve()
              //       setState(prevState => {
              //         const data = [...prevState.data]
              //         data.splice(data.indexOf(oldData), 1)
              //         return { ...prevState, data }
              //       })
              //     }, 600)
              //   })
            }
          }
          localization={{
            pagination: {
              labelDisplayedRows: `{from}-{to} ${t(
                breadcrumb + '.of'
              )} {count}`,
              labelRowsSelect: t(`${breadcrumb}.rows`),
              firstAriaLabel: t(`${breadcrumb}.FirstPage`),
              firstTooltip: t(`${breadcrumb}.FirstPage`),
              previousAriaLabel: t(`${breadcrumb}.PreviousPage`),
              previousTooltip: t(`${breadcrumb}.PreviousPage`),
              nextAriaLabel: t(`${breadcrumb}.NextPage`),
              nextTooltip: t(`${breadcrumb}.NextPage`),
              lastAriaLabel: t(`${breadcrumb}.LastPage`),
              lastTooltip: t(`${breadcrumb}.LastPage`)
            },
            toolbar: {
              nRowsSelected: '{0} row(s) selected',
              searchTooltip: t(`${breadcrumb}.Search`),
              searchPlaceholder: t(`${breadcrumb}.Search`)
            },
            header: {
              actions: t(`${breadcrumb}.Actions`)
            },
            body: {
              emptyDataSourceMessage: t(`${breadcrumb}.NRTD`),
              filterRow: {
                filterTooltip: t(`${breadcrumb}.Filter`)
              }
            },
            grouping: {
              placeholder: t(`${breadcrumb}.DHHTGB`)
            }
          }}
        />
      </div>

      <ScrollDialog
        open={open}
        onClose={onClose}
        onCancel={onClose}
        cancelText={t(`${breadcrumb}.Cancel`)}
        onSubmit={
          action === 'create'
            ? handleCreate
            : action === 'update'
            ? handleUpdate
            : handleDelete
        }
        submitText={
          action === 'create'
            ? t(`${breadcrumb}.Save`)
            : action === 'update'
            ? t(`${breadcrumb}.OK`)
            : t(`${breadcrumb}.OK`)
        }
        isSubmitting={isSubmitting}
        resetForm={resetForm}
        title={
          action === 'create'
            ? t(`${breadcrumb}.NewInvitation`)
            : action === 'update'
            ? t(`${breadcrumb}.UpdateInvitation`)
            : t(`${breadcrumb}.DeleteInvitation`)
        }
        maxWidth="md"
      >
        {action !== 'delete' ? (
          <Fragment>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="coupon"
              autoComplete="coupon"
              id={
                errors.coupon && touched.coupon
                  ? 'standard-error-helper-text'
                  : 'coupon'
              }
              label={
                errors.coupon && touched.coupon
                  ? 'Error Coupon'
                  : t(`${breadcrumb}.Coupon`)
              }
              error={errors.coupon && touched.coupon ? true : false}
              helperText={
                errors.coupon && touched.coupon ? errors.coupon : false
              }
              value={values.coupon}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="reason"
              autoComplete="reason"
              id={
                errors.reason && touched.reason
                  ? 'standard-error-helper-text'
                  : 'reason'
              }
              label={
                errors.reason && touched.reason
                  ? 'Error Reason'
                  : t(`${breadcrumb}.Reason`)
              }
              error={errors.reason && touched.reason ? true : false}
              helperText={
                errors.reason && touched.reason ? errors.reason : false
              }
              value={values.reason}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <FormControl
              variant="outlined"
              margin="normal"
              fullWidth
              error={errors.menuId}
            >
              <InputLabel id="menu-label">{t(`${breadcrumb}.Menu`)}</InputLabel>
              <Select
                labelId="menu-label"
                id="menu"
                value={values.menuId}
                onChange={handleChange}
                label={t(`${breadcrumb}.Menu`)}
                inputProps={{
                  name: 'menuId',
                  id: 'menu-label'
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="phuc-long">Phúc Long</MenuItem>
                <MenuItem value="go-cafe">Gờ Cafe</MenuItem>
                <MenuItem value="highlands">Highlands</MenuItem>
              </Select>
              {errors.menuId && touched.menuId ? (
                <FormHelperText>{errors.menuId}</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
            <FormControl
              variant="outlined"
              margin="normal"
              fullWidth
              required
              error={
                errors.isPublic && touched.isPublic ? errors.isPublic : false
              }
              component="fieldset"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    value="allowExtraEmails"
                    color="primary"
                    checked={values.isPublic}
                    onChange={() => {
                      setFieldValue('isPublic', !values.isPublic)
                    }}
                  />
                }
                label={t(`${breadcrumb}.Public`)}
              />
              {errors.isPublic && touched.isPublic ? (
                <FormHelperText>{errors.isPublic}</FormHelperText>
              ) : (
                false
              )}
            </FormControl>
          </Fragment>
        ) : (
          t(`${breadcrumb}.AYSYWTDTI`)
        )}
      </ScrollDialog>
    </div>
  )
}
