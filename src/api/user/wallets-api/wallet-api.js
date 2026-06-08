import axiosInstance from "../../../config/axiosConfig";

export const getWithdrawalRequestsAPI = async () => {

  try {
    const response = await axiosInstance.get('/api/v1/wallet/fetchWithDrawReq', { withCredentials: true });
    //console.log("Respopnse list of Withdrawal requests :", response.data)
    return response?.data;

  } catch (error) {
    console.error('Fetch user Withdrawal request list -  API call failed:', error);
    throw error;
  }
};

export const cancelWithdrawalRequestAPI = async (walletId) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/wallet/${walletId}/cancel`,
      {},
      { withCredentials: true }
    );
    console.log('Cancellation successful for wallet:', walletId);
    return response.data;
  } catch (error) {
    console.error('Cancel withdrawal request failed:', error);
    throw error;
  }
};


export const createWithdrawalRequestAPI = async (data) => {

  try {
    const response = await axiosInstance.post('/api/v1/wallet/withdraw', data);
    return response.data;
  } catch (error) {
    console.error('Withdrawal request API call failed:', error);
    throw error;
  }
};

export const getWalletBalanceAPI = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/wallet/balance', { withCredentials: true });


    return response;
  } catch (error) {
    console.error('get balance API call failed:', error);
    throw error;
  }
};