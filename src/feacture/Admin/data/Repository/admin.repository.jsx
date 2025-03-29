import { getPendingRequests , approveUser } from "../../../Login/data/DataSource/register.api";
export const adminRepository = {
    getRequests: getPendingRequests,
    approve: approveUser
};
