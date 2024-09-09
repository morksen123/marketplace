import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { CreateProductListing } from "@/features/ProductListing/components/CreateProductListing";

export const CreateProductListingRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <CreateProductListing />
    </div>
  );
};
