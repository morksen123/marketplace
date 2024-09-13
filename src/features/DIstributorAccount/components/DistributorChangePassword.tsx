import ChangePassword from "@/components/profile/ChangePassword";

const handleDistributorPasswordChange = (currentPassword: string, newPassword: string) => {
    console.log(currentPassword, newPassword);
}

const DistributorChangePassword = () => {
    return (
        <ChangePassword onSubmit={handleDistributorPasswordChange} />
    )
}  

export default DistributorChangePassword;
