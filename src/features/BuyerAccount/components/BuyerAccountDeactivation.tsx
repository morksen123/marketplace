import AccountDeactivation from '@/components/profile/AccountDeactivation';

const handleDeactivate = async (password: string) => {
  // Buyer-specific deactivation logic
  try {
    const response = await fetch(`http://localhost:8080/api/buyer/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      throw new Error('Failed to deactivate account');
    }
  } catch (error) {
    console.error('Error deactivating account:', error);
  }
};

const BuyerAccountDeactivation = () => {
  return (
    <AccountDeactivation userType="Buyer" onDeactivate={handleDeactivate} />
  );
};

export default BuyerAccountDeactivation;
