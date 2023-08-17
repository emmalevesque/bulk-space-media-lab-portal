import { groq } from "next-sanity";
import { Tool, useClient } from "sanity";
import { MenuIcon } from "@sanity/icons";
import useSWR from "swr";
import LoadingOverlay from "components/LoadingOverlay";
import { Box, Card, Heading, Stack, Text } from "@sanity/ui";
import CategoryDetails from "./CategoryDetails";
import { useNavigation } from "./hooks/useNavigation";

const childrenQuery = (childQuery) => groq`
  count(*[_type == "category" && defined(parent) && parent._ref == ^._id]) > 0 => {
    "children": *[_type == "category" && defined(parent) && parent._ref == ^._id][] | order(title asc){
      ...,
      ${childQuery}
    }
  }
`;

const NavigationStructureComponent = (props) => {
  const client = useClient();

  const fetcher = (query, params) => client.fetch(query, params);

  const { data, isLoading, error } = useSWR(
    [
      groq`*[_id == "menu"][0].categories[]->{
      ...,
      "_key": _id,
     ${childrenQuery(childrenQuery(""))} 
    } | order(title asc)`,
    ],
    fetcher
  );

  const { activeCategory, handleCategoryClick } = useNavigation();

  if (isLoading) return <LoadingOverlay />;

  if (error) throw new Error(error);

  return data ? (
    <Stack padding={4} space={4}>
      <Heading as="h2">Equipment Inventory Navigation</Heading>
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

const NavigationStructure = (): Tool<any> => ({
  name: "navigation-structure",
  title: "Navigation Structure",
  icon: MenuIcon,
  component: NavigationStructureComponent,
});

export default NavigationStructure;
