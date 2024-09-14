import AccountDeactivation from '@/components/profile/AccountDeactivation';

const handleDeactivate = async (password: string) => {
  // Buyer-specific deactivation logic
  try {
    const response = await fetch(`http://localhost:8080/api/buyer/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtdXJzeWlkQGVtYWlsLmNvbSIsImlhdCI6MTcyNjIxMDE4NywiZXhwIjoxNzI2ODE0OTg3fQ.yOW1A2-0SYqXXTfWEUc5xd9Vn7PvZyVPEi1C4Wg4NxA`,
      },
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
