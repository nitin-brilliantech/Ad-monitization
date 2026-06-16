import axiosInstance from "../../../config/axiosConfig";


export const getAllTicketAPI = async () => {
  const response = await axiosInstance.get("/api/v2/ticket/all", {withCredentials:true});
  return response?.data.data;
};


export const updateStatusTicketAPI = async (id,data) => {
  const response = await axiosInstance.put(`/api/v2/ticket/${id}/status`, data, {withCredentials:true});
  console.log(response.data)
  return response?.data?.data;
};