import axiosInstance from "../../../config/axiosConfig";

export const createCampaignAPI = async (data) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (
      (key === "imageFiles" || key === "videoFiles" || key === "productFiles") &&
      Array.isArray(value)
    ) {
      value.forEach((file) => {
        formData.append(key, file);
      });
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const response = await axiosInstance.post("/api/v1/campaign/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data;
};

export const updateUserCampaign = async (id, data, oldImages = [], oldVideos = []) => {
  const formData = new FormData();

  // Append new files only if they are actual File instances
  ['imageFiles', 'videoFiles', 'productFiles'].forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key].forEach((file) => {
        if (file instanceof File) formData.append(key, file);
      });
    }
  });

  // Append old files info for backend to keep existing files
  formData.append("existingFiles", JSON.stringify([...oldImages, ...oldVideos]));

  // Append other fields (skip file keys)
  Object.entries(data).forEach(([key, value]) => {
    if (['imageFiles', 'videoFiles', 'productFiles'].includes(key)) return;

    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  const token = localStorage.getItem("token");

  const response = await axiosInstance.put(`/api/v1/campaign/${id}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  return response?.data;
};


export const getCampaignsAPI = async () => {
  const response = await axiosInstance.get("api/v1/campaign/all", {
    withCredentials: true,
  });
  return response?.data;
};
export const getCampaignsPaymentHistoryAPI = async () => {
  const response = await axiosInstance.get("api/v1/campaign/payment-history", {
    withCredentials: true,
  });
  return response?.data?.data;
};

export const getCampaignByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/api/v1/campaign/${id}`, {
    withCredentials: true,
  });
  return response?.data?.data;
};

export const deleteCampaignAPI = async (id) => {
  const response = await axiosInstance.delete(`/api/v1/campaign/${id}/delete`, {
    withCredentials: true,
  });
  return response?.data;
};
