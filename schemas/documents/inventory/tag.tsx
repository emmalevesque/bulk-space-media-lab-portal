import EmojiIcon from "components/Icon/Emoji";
import { defineType } from "sanity";

export default defineType({
  name: "tag",
  title: "Tag",
  icon: () => <EmojiIcon>🏷️</EmojiIcon>,
  type: "document",
  fields: [
    {
      name: "name",
      title: "Tag Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Tag Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
  ],
});
