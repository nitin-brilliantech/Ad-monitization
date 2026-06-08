import axiosInstance from "../../../config/axiosConfig";


export const getRetailerCampaigns = async () => {
  try {
    const response = axiosInstance.get(
      "/api/v1/retailers/fetchActiveCampaigns",
      {
        withCredentials: true,
      }
    );
    return (await response)?.data?.data;
  } catch (error) {
    console.error("Error fetching retailer campaigns:", error);
    throw error;
  }
};


export const getEndedCampaigns = async () => {
  try {
    const response = axiosInstance.get(
      "/api/v1/retailers/expired-campaigns",
      {
        withCredentials: true,
      }
    );
    return (await response)?.data?.data;
  } catch (error) {
    console.error("Error fetching retailer campaigns:", error);
    throw error;
  }
};


export const requestRevenue = async (campaignId) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/retailers/${campaignId}/request`,
      { withCredentials: true }
    );
    return response?.data?.data;
  } catch (error) {
    console.error("Error requesting revenue:", error);
    throw error;
  }
};
