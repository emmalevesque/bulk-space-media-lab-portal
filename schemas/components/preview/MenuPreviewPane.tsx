import { groq } from "next-sanity";
import useSWR from "swr";
import LoadingOverlay from "components/LoadingOverlay";
import { Heading, Stack } from "@sanity/ui";
import CategoryDetails from "tools/Navigation/CategoryDetails";
import { useNavigation } from "tools/Navigation/hooks/useNavigation";
import { useClient } from "sanity";

const childrenQuery = (childQuery) => groq`
  count(*[_type == "category" && defined(parent) && parent._ref == ^._id]) > 0 => {
    "children": *[_type == "category" && defined(parent) && parent._ref == ^._id]{
      ...,
      ${childQuery}
    }
  }
`;

const MenuPreviewPaneComponent = (props) => {
  const client = useClient({
    apiVersion: "2021-03-25",
  });

  const fetcher = (query, params) => client.fetch(query, params);

  const { data, isLoading, error } = useSWR(
    [
      groq`*[_id == "menu"][0].categories[]->{
      ...,
      "_key": _id,
     ${childrenQuery(childrenQuery(""))} 
    }`,
    ],
    fetcher
  );

  const { activeCategory, handleCategoryClick } = useNavigation();

  if (isLoading) return <LoadingOverlay />;

  if (error) throw new Error(error);

  return data ? (
    <Stack padding={4} space={4}>
      <Heading as="h2">Equipment Inventory Navigation</Heading>
      <Heading as="h3">Active Category: {activeCategory} </Heading>
      <Stack space={3}>
        {data.map((category) => (
          <CategoryDetails
            {...category}
            key={category._key}
            category={category}
            isActive={activeCategory === category.slug.current}
            onClick={handleCategoryClick}
          />
        ))}
      </Stack>
    </Stack>
  ) : (
    <LoadingOverlay />
  );
};

export default MenuPreviewPaneComponent;
