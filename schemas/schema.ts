import category from './documents/inventory/category'
import check from './documents/inventory/check'
import checkout from './documents/inventory/checkout'
import item from './documents/inventory/item'
import kit from './documents/inventory/kit'
import tag from './documents/inventory/tag'
import page from './documents/page'
import staff from './documents/user/staff'
import user from './documents/user/user'
import conditionReport from './objects/conditionReport'
import contact from './objects/contact'
import qrCode from './objects/qrCode'
import menu from './singletons/menu'

import description from './objects/fields/description'
import link from './objects/fields/link'

export const schema = [
  category,
  check,
  checkout,
  contact,
  item,
  kit,
  menu,
  page,
  staff,
  tag,
  user,
  qrCode,
  conditionReport,
  // fields
  description,
  link,
]
