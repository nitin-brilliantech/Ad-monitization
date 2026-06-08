import axiosInstance from "../../../config/axiosConfig";

export const getCampaignsAPI = async () => {
  const response = await axiosInstance.get("/api/v2/campaign/all", {
    withCredentials: true,
  });
  return response?.data?.data;
};



export const getCampaignPaymentHistoryAPI = async () => {
  const response = await axiosInstance.get("/api/v2/campaign/payment-history", {
    withCredentials: true,
  });
  return response?.data?.data;
};




export const getCampaignRevenueRequestAPI = async () => {
  const response = await axiosInstance.get("/api/v2/campaign/revenue-request", {
    withCredentials: true,
  });
  return response?.data?.data;
};


export const transferRevenueAPI = async (id) => {
  const response = await axiosInstance.put(
    `/api/v2/campaign/${id}/transfer`,
    { withCredentials: true }
  );
  return response?.data;
};



export const toggleCampaignStatusAPI = async (id, status) => {
  const response = await axiosInstance.put(`/api/v2/campaign/${id}/activate`, {status});
  return response?.data;
};




export const getCampaignByIdAPI = async (id) => {
  const response = await axiosInstance.get(
    `/api/v2/campaign/${id}`,

    {
      withCredentials: true,
    }
  );
 
  return response?.data?.data;
};

export const campaignApprovalApi=async(id,payload)=>{
  const response = await axiosInstance.put(`/api/v2/campaign/${id}/approval`,payload,

    {
      withCredentials:true
    }
  )
  return response?.data;
}











///create and update campaign

export const createCampaignAPI = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (
      value instanceof Date ||
      (typeof value === "object" && value?.$d)
    ) {
      const isoDate = new Date(value.$d || value).toISOString();
      formData.append(key, isoDate);
    } else if (Array.isArray(value)) {
      if (key === "targetRegions") {
        const regionNames = value.map((region) => region.name);
        formData.append(key, JSON.stringify(regionNames));
      } else {
        formData.append(key, JSON.stringify(value));
      }
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  const response = await axiosInstance.post(
    "/api/v2/campaign/createCampaign",
    formData,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};



export const updateUserCampaign = async (id , data) =>  {
  const response = await axiosInstance.put(`/api/v2/campaign/${id}/updateCampaign` , data ,
    {
      withCredentials: true,
    }
  )
  return response?.data;

}