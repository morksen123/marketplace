import AccountDeactivation from "@/components/profile/AccountDeactivation";

const handleDeactivate = (password: string) => {
  // Buyer-specific deactivation logic
};

const BuyerAccountDeactivation = () => {
  return (
    <AccountDeactivation userType="Distributor" onDeactivate={handleDeactivate} />
  );
};

export default BuyerAccountDeactivation;