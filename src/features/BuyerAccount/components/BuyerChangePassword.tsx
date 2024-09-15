import ChangePassword from '@/components/profile/ChangePassword';

const handleBuyerPasswordChange = async (
  currentPassword: string,
  newPassword: string,
) => {
  // to be updated with API calls
  console.log(currentPassword, newPassword);

  try {
    fetch('http://localhost:8080/api/buyer/change-password', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currPassword: currentPassword,
        newPassword: newPassword
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
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
    console.error('Error:', error);
  }
};

const BuyerChangePassword = () => {
  return <ChangePassword onSubmit={handleBuyerPasswordChange} />;
};

export default BuyerChangePassword;
