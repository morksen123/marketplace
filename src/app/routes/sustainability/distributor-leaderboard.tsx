import { DistributorNavMenu } from "@/features/NavigationMenu/components/DistributorNavMenu";
import { DistributorLeaderboard } from "@/features/Sustainability/Leaderboard/DistributorLeaderboard";
export const DistributorLeaderboardRoute = () => {
  return (
    <div>
      <DistributorNavMenu />
      <DistributorLeaderboard />
    </div>
  );
};