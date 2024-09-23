import ChangePassword from '@/components/profile/ChangePassword';
import { handleSuccessApi } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';



const DistributorChangePassword = () => {
  const navigate = useNavigate();

const handleDistributorPasswordChange = async (
  currentPassword: string,
  newPassword: string,
) => {
  console.log(currentPassword, newPassword);
  try {
    await fetch('http://localhost:8080/api/distributor/change-password', {
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
      navigate('/distributor/profile');
      handleSuccessApi('Success!', 'Password has been changed.');
      console.log(data); // Should be the success message
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } catch (error) {
    console.error('Error:', error);
  }
};

  return <ChangePassword onSubmit={handleDistributorPasswordChange} />;
};

export default DistributorChangePassword;
