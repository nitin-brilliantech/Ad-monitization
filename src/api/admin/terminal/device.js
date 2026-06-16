import axiosInstance from "../../../config/axiosConfig";

export const getAllRequestAPI = async () => {
  const response = await axiosInstance.get("/api/v2/terminal/all");
  return response?.data?.data;
};

export const updateRequestStatusAPI = async (id, status, remark = "") => {
  const response = axiosInstance.put(`/api/v2/terminal/${id}/status`, {
    status: status,
    remark,
  });
  return (await response).data;
};

export const getAllDevicesAPI = async () => {
  const response = await axiosInstance.get("/api/v2/terminal/devices");
  return response?.data?.data;
};

export const updateDeviceCountAPI = async (deviceId, payload) => {
  const response = await axiosInstance.patch(
    `/api/v2/terminal/count/${deviceId}/update`,
    payload
  );
  console.log( `/api/v2/terminal/count/${deviceId}/update`);
  return response?.data?.data; 
};
