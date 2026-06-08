import axiosInstance from "../../../config/axiosConfig";


export const getDropDownDataAPI = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/campaign/getCampDropData", {
      withCredentials: true,
    });
    return response.data.data;  // return only dropdown data { products, locations, devices }
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    throw error;
  }
};



export const estimatePrice = async (data) => {
  const response = await axiosInstance.post("/api/v1/campaign/baseCost", data, {
    withCredentials: true,
  });
 
  return response?.data?.data?.baseCost;
};