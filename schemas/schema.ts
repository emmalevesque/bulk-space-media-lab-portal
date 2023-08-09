import category from './documents/inventory/category'
import check from './documents/inventory/check'
import checkout from './documents/inventory/checkout'
import item from './documents/inventory/item'
import kit from './documents/inventory/kit'
import page from './documents/page'
import staff from './documents/user/staff'
import tag from './documents/inventory/tag'
import user from './documents/user/user'
import contactInformation from './objects/contactInformation'
import navigation from './singletons/menu'

export const schema = [
  category,
  check,
  checkout,
  contactInformation,
  item,
  kit,
  navigation,
  page,
  staff,
  tag,
  user,
]
