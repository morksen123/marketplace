import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { Leaderboard } from "@/features/Sustainability/Leaderboard/Leaderboard";
export const LeaderboardRoute = () => {
  return (
    <div>
      <BuyerNavMenu showTabs={false} />
      <Leaderboard />
    </div>
  );
};