import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { EditProductListing } from "@/features/ProductListing/components/EditProductListing";

export const EditProductListingRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <EditProductListing />
    </div>
  );
};
