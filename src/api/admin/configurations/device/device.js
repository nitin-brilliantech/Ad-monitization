import axiosInstance from "../../../../config/axiosConfig";
export const getDevicesAPI = async () => {
  const response = await axiosInstance.get("/api/v2/device/all", {
    withCredentials: true,
  });
  return response.data;
};

export const createDeviceAPI = async (payload) => {
  const response = await axiosInstance.post("/api/v2/device/create", payload, {
    withCredentials: true,
  });

  return response.data;
};

export const updateDeviceAPI = async (id, payload) => {
  const response = await axiosInstance.put(`/api/v2/device/${id}/update`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteDeviceAPI = async (id) => {
  const response = await axiosInstance.delete(`/api/v2/device/${id}/delete`, {
    withCredentials: true,
  });
  return response.data;
};

export const getDeviceByIdOrNameAPI = async (identifier) => {
  const response = await axiosInstance.get(`/api/v2/device/${identifier}`, {
    withCredentials: true,
  });
  return response.data;
};
