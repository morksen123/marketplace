import AccountDeactivation from "@/components/profile/AccountDeactivation";

const handleDeactivate = async (password: string) => {
  // Buyer-specific deactivation logic
  try {
    await fetch(`http://localhost:8080/api/distributor/deactivate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to deactivate account');
      } 
      return response.text();
    })
    .then(data => {
      console.log(data); // Should be the success message
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } catch (error) {
    console.error('Error deactivating account:', error);
  }
};

const DistributorAccountDeactivation = () => {
  return (
    <AccountDeactivation userType="Distributor" onDeactivate={handleDeactivate} />
  );
};

export default DistributorAccountDeactivation;