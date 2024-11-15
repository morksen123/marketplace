import { BuyerNavMenu } from "@/features/NavigationMenu/components/BuyerNavMenu";
import { Leaderboard } from "@/features/Sustainability/Leaderboard/Leaderboard";
export const LeaderboardRoute = () => {
  return (
    <div className="w-full">
      <BuyerNavMenu showTabs={false} />
      <Leaderboard />
    </div>
  );
};