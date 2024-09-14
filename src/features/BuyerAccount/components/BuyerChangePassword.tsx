import ChangePassword from '@/components/profile/ChangePassword';

const handleBuyerPasswordChange = async (
  currentPassword: string,
  newPassword: string,
) => {
  // to be updated with API calls
  console.log(currentPassword, newPassword);

  try {
    const response = await fetch(
      `http://localhost:8080/api/buyer/change-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      throw new Error('Failed to update password');
    }
  } catch (error) {
    console.error('Error updating password:', error);
  }
};

const BuyerChangePassword = () => {
  return <ChangePassword onSubmit={handleBuyerPasswordChange} />;
};

export default BuyerChangePassword;
