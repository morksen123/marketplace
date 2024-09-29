import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { InventoryManagementPage } from "@/features/InventoryManagement/pages/InventoryMangementPage";

export const InventoryManagementRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <InventoryManagementPage />
    </div>
  );
};