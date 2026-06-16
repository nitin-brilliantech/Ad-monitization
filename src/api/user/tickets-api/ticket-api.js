import axiosInstance from "../../../config/axiosConfig";



export const createTicketAPI = async (data) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "media" && Array.isArray(value)) {
      value.forEach((file) => {
        if (file instanceof File) formData.append("media", file);
      });
    } else if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const response = await axiosInstance.post("/api/v1/ticket/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data?.data;
};


export const getAllTicketAPI = async () => {
  const response = await axiosInstance.get("/api/v1/ticket/all", {withCredentials:true});
  console.log(response.data)
  return response?.data?.data;
};


export const updateStatusTicketAPI = async (id,data) => {
  const response = await axiosInstance.put(`/api/v1/ticket/${id}/status`, data);
  console.log(response.data)
  return response?.data?.data;
};