import axiosInstance from "../../../config/axiosConfig";

export const createTicketAPI = async (data) => {
  const response = await axiosInstance.post("/api/v1/ticket/create", data);
  return response.data;
};