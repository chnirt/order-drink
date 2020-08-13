import * as Yup from 'yup'

export const createInvitationSchema = Yup.object({
  coupon: Yup.string()
    .required('Coupon is required')
    .max(10, 'Coupon must be at most 10 characters'),
  reason: Yup.string().required('Reason is required'),
  menuId: Yup.string().required('Menu is required'),
  isPublic: Yup.bool()
})
