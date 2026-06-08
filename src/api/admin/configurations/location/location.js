// src/api/tierApi.js
import axiosInstance from "../../../../config/axiosConfig";

// CREATE Tier
export const createTierAPI = async (data) => {
  const response = await axiosInstance.post(
    "/api/v2/tier/create",
    data, //  send data as body
    { withCredentials: true } //  config here
  );
  return response.data;
};

// GET all Tiers
export const getAllTierAPI = async () => {
  const response = await axiosInstance.get(
    "/api/v2/tier/all",
    { withCredentials: true }
  );
  return response.data;
};

// GET Tier by ID or Name
export const getTieryIdOrName = async (identifier) => {
  const response = await axiosInstance.get(
    `/api/v2/tier/${identifier}`,
    { withCredentials: true }
  );
  return response.data;
};

// UPDATE Tier
export const updateTierAPI = async (data, id) => {
  const response = await axiosInstance.put(
    `/api/v2/tier/${id}/update`,
    data, //  send data as body
    { withCredentials: true }
  );
  return response.data;
};

// DELETE Tier
export const deleteTierAPI = async (id) => {
  const response = await axiosInstance.delete(
    `/api/v2/tier/${id}/delete`,
    { withCredentials: true }
  );
  return response.data;
};
