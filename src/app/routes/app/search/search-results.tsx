import SearchResults from "@/features/ProductCatalogue/components/SearchResults";
import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";

export const SearchResultsRoute = () => {
  return (
  <>
  <BuyerNavMenu showTabs={false} />
  <SearchResults />
  </>
  )
};