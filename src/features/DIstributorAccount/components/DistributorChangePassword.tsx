import ChangePassword from "@/components/profile/ChangePassword";

const handleDistributorPasswordChange = async (currentPassword: string, newPassword: string) => {
    console.log(currentPassword, newPassword);
    try {
        const response = await fetch(`http://localhost:8080/api/distributor/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYW1hQGVtYWlsLmNvbSIsImlhdCI6MTcyNjI0ODA4NiwiZXhwIjoxNzI2ODUyODg2fQ.6SxEL4IrmskwZSfwDsQaD8U-P7ORO35i_iseZJ44kVI`
        },
          body: JSON.stringify({ currentPassword, newPassword })
        });
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
}

const DistributorChangePassword = () => {
    return (
        <ChangePassword onSubmit={handleDistributorPasswordChange} />
    )
}  

export default DistributorChangePassword;
