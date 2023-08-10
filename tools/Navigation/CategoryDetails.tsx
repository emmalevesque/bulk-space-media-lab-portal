import { Text, Card, Box, Heading, Stack, Button, Inline } from "@sanity/ui";
import { SanityDocument } from "next-sanity";
import classNames from "classnames";
import { Slug } from "sanity";

type CategoryProps = SanityDocument & {
  slug: Slug;
  title: string;
  children?: CategoryProps[];
  _key?: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export default function CategoryDetails({ title, children }: CategoryProps) {
  return Array.isArray(children) ? (
    <Card paddingX={4}>
      {Array.isArray(children) ? (
        <details>
          <summary>{title}</summary>
          <>
            {children.map((child) => (
              <CategoryDetails {...child} />
            ))}
          </>
        </details>
      ) : (
        <Card paddingY={2} paddingX={4} tone="default">
          <Text>{title}</Text>
        </Card>
      )}
    </Card>
  ) : (
    <Card paddingY={2} paddingX={4} tone="default">
      <Text>{title}</Text>
    </Card>
  );
}
