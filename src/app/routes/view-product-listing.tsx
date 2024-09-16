import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { ViewProductListing } from "@/features/ProductListing/components/ViewProductListing";

export const ViewProductListingRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <ViewProductListing />
    </div>
  );
};
