import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { WasteAuditDashboard } from "@/features/Sustainability/WasteAudit/components/WasteAuditDashboard";

export const WasteAuditRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <WasteAuditDashboard />
    </div>
  );
};