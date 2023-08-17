import { Card, Box, Heading, Stack, Button } from "@sanity/ui";
import { SanityDocument } from "next-sanity";
import classNames from "classnames";
import { Slug } from "sanity";

type CategoryProps = SanityDocument & {
  slug: Slug;
  title: string;
  children?: CategoryProps[];
  _key?: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function Category({
  slug,
  title,
  _id,
  children,
  isActive,
  onClick,
}: CategoryProps) {
  return (
    <Card
      padding={4}
      radius={2}
      shadow={1}
      className={classNames({
        hidden: !isActive,
      })}
    >
      <Box marginBottom={4}>
        <Heading
          as="h3"
          size={1}
          key={_id}
          onClick={onClick ? onClick : () => {}}
          data-category={slug.current}
        >
          <Button
            onClick={onClick ? onClick : () => {}}
            data-category={slug.current}
            label={title}
          >
            {title}
          </Button>
        </Heading>
      </Box>
      <Stack
        paddingX={4}
        space={2}
        className={classNames("category", slug.current)}
      >
        {Array.isArray(children)
          ? children.map((child) => <Category {...child} />)
          : null}
      </Stack>
    </Card>
  );
}
