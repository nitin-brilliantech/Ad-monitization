import axiosInstance from "../../../config/axiosConfig";

export const makePayoutAPI = async (id) => {
  const response = await axiosInstance.post(
    `/api/v2/transfer/payout/${id}/pay`);
  return response.data;
};


export const verifyPayoutApi = async (raw) => {
  const response = await axiosInstance.post('/api/v2/transfer/payout/webhook', raw
  );
  return response.data;
}

export const fetchWithdrawalRequestAPI = async () => {
  const response = await axiosInstance.get(
    `/api/v2/withdrawal/all`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const updateWithdrawStatusAPI = async (withdraw_id, status, remark = "") => {
  const response = await axiosInstance.put(
    `/api/v2/withdrawal/${withdraw_id}/status`,
    {
      isApproved: status,
      remark   // ✅ include rejection reason
    }
  );
  return response.data;
};










