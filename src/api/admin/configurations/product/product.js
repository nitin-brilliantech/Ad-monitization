// src/api/ProductApi.js
import axiosInstance from "../../../../config/axiosConfig";

// CREATE product
export const createProductAPI = async (data) => {
  const response = await axiosInstance.post(
    "/api/v2/product/create",
    data, //  send data as body
    { withCredentials: true } //  config here
  );
  return response.data;
};

// GET all products
export const getAllProductAPI = async () => {
  const response = await axiosInstance.get(
    "/api/v2/product/all",
    { withCredentials: true }
  );
  return response.data;
};

// GET product by ID or Name
export const getproductyIdOrName = async (identifier) => {
  const response = await axiosInstance.get(
    `/api/v2/product/${identifier}`,
    { withCredentials: true }
  );
  return response.data;
};

// UPDATE product
export const updateProductAPI = async (data, id) => {
  const response = await axiosInstance.put(
    `/api/v2/product/${id}/update`,
    data, //  send data as body
    { withCredentials: true }
  );
  return response.data;
};

// DELETE product
export const deleteProductAPI = async (id) => {
  const response = await axiosInstance.delete(
    `/api/v2/product/${id}/delete`,
    { withCredentials: true }
  );
  return response.data;
};
