import { structure } from '.'
import category from '../schemas/documents/inventory/category'
import checkout from '../schemas/documents/inventory/checkout'
import {
  checkoutActions,
  getCheckoutStatusProps,
} from '../schemas/documents/inventory/hooks/useCheckout'
import item from '../schemas/documents/inventory/item'
import kit from '../schemas/documents/inventory/kit'
import tag from '../schemas/documents/inventory/tag'
import staff from '../schemas/documents/user/staff'
import user from '../schemas/documents/user/user'
import settings from '../schemas/singletons/settings'

export const structureConfig = (S, context) =>
  structure(
    S,
    [
      {
        type: 'list',
        title: 'Manage Checkouts',
        icon: checkout.icon,
        typeDefs: [
          {
            ...checkout,
            title: 'All Checkouts',
            icon: checkout.icon,
          },
          {
            ...checkout,
            title: 'Pending Checkouts',
            icon: getCheckoutStatusProps(null, 'PENDING').icon,
          },
          {
            ...checkout,
            title: 'Hot Checkouts',
            icon: getCheckoutStatusProps(null, 'CHECKED_OUT').icon,
          },
          {
            ...checkout,
            title: 'Cold Checkouts',
            icon: getCheckoutStatusProps(null, 'RETURNED').icon,
          },
        ],
      },
      S.divider(),
      {
        type: 'list',
        title: 'Manage Inventory',
        icon: item.icon,
        typeDefs: [
          {
            type: 'list',
            title: 'Inventory Items',
            icon: item.icon,
            typeDefs: [
              {
                ...item,
                title: 'All Items',
              },
              {
                ...item,
                title: 'Available Items',
                icon: checkoutActions.RETURNED.emoji,
              },
              {
                ...item,
                title: 'Unavailable Items',
                icon: checkoutActions.CHECKED_OUT.emoji,
              },
              {
                ...item,
                title: 'All Variants',
                icon: checkoutActions.DEFAULT.emoji,
              },
            ],
          },
          kit,
          category,
          tag,
        ],
      },
      {
        ...user,
      },
      {
        type: 'list',
        title: 'Settings',
        icon: settings.icon,
        typeDefs: [staff],
      },
      S.divider(),
    ],
    context
  )
