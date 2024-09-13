import ChangePassword from "@/components/profile/ChangePassword";

const handleBuyerPasswordChange = (currentPassword: string, newPassword: string) => {
  // to be updated with API calls  
  console.log(currentPassword, newPassword);
}


const BuyerChangePassword = () => {
    return (
        <ChangePassword onSubmit={handleBuyerPasswordChange} />
    )
}

export default BuyerChangePassword;