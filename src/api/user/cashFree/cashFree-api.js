import axiosInstance from "../../../config/axiosConfig";


export const createOrder_cashFree = async (data) => {
  console.log("sending Data: ",data);
  const response = await axiosInstance.post(
    `/api/v1/cashfree/create-order`,
 
    data
  );
  return response?.data?.data;
};


export const checkCashfreePaymentStatus = async (paymentSessionId) => {
  const res = await axiosInstance.get(`/api/v1/cashfree/check-status/${paymentSessionId}`);
  return res?.data;
};
