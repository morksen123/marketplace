import AccountDeactivation from "@/components/profile/AccountDeactivation";

const handleDeactivate = (password: string) => {
  // Buyer-specific deactivation logic
};

const BuyerAccountDeactivation = () => {
  return (
    <AccountDeactivation userType="Buyer" onDeactivate={handleDeactivate} />
  );
};

export default BuyerAccountDeactivation;