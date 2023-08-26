import category from './documents/inventory/category'
import check from './documents/inventory/check'
import checkout from './documents/inventory/checkout'
import item from './documents/inventory/item'
import kit from './documents/inventory/kit'
import page from './documents/page'
import staff from './documents/user/staff'
import tag from './documents/inventory/tag'
import user from './documents/user/user'
import contact from './objects/contact'
import menu from './singletons/menu'
import qrCode from './objects/qrCode'

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
]
