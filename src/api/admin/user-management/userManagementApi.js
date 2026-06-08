import axiosInstance from "../../../config/axiosConfig";

export const getUsersAPI = async () => {
  const response = await axiosInstance.get("/api/v2/users", {
    withCredentials: true,
  });  
  return response?.data?.data;
};

export const createUserAPI = async (payload) => {
  const response = await axiosInstance.post(
    "/api/v2/users/addUser",
    payload,
    {
      withCredentials: true,
    }
  );
  return response?.data?.data;
};

export const toggleUserStatusAPI = async (id, status) => {
  const response = await axiosInstance.put(
    `/api/v2/users/${id}/status`,
    { status },
    {
      withCredentials: true,
    }
  );
  return response?.data?.data;
};



export const registerUSerApi=async(data)=>{
  const response =await axiosInstance.post(
    `/api/v2/auth/register`,data,{
      withCredentials:true
    }
  )
  return response?.data?.data;
}