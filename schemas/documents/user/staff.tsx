import EmojiIcon from 'components/Icon/Emoji'
import { defineType } from 'sanity'
import user from './user'

export default defineType({
  ...user,
  name: 'staff',
  title: 'Staff',
  icon: () => <EmojiIcon>🫂</EmojiIcon>,
  initialValue: {
    role: 'staff',
  },
  fieldsets: [
    {
      name: 'name',
      options: {
        columns: 2,
        collapsible: false,
      },
    },
  ],
  fields: [
    {
      fieldset: 'name',
      name: 'givenName',
      title: 'First name',
      type: 'string',
      readOnly: true,
    },
    {
      fieldset: 'name',
      name: 'familyName',
      title: 'Last name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'displayName',
      title: 'Display name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'sanityUserId',
      title: 'Sanity User ID',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'loginProvider',
      title: 'Login provider',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      displayName: 'displayName',
      imageUrl: 'imageUrl',
      email: 'email',
    },
    prepare({ displayName, imageUrl, email }) {
      return {
        title: `${displayName}`,
        subtitle: `${email}`,
        media: imageUrl ? (
          <img
            className="overflow-hidden rounded-full"
            src={imageUrl}
            alt={displayName}
          />
        ) : null,
      }
    },
  },
})
