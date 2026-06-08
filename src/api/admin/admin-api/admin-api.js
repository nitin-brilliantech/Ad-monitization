import axiosInstance from "../../../config/axiosConfig";


export const loginUserApi = async (credentials) => {
  const response = await axiosInstance.post(
    `/api/v2/auth/login`,
    credentials
  );
  return response?.data?.data;
};


export const fetchUserAPI = async () => {
  const response = await axiosInstance.get(
    `/api/v2/users/myProfile`,
    {
      withCredentials: true,
    }
  );
  return response?.data?.data;
};


export const updateUserAPI = async (data) => {
  const response = await axiosInstance.put(`/me`, data);
  return response?.data?.data;
};


export const getAdminProfile = async () => {
  const response = await axiosInstance.get('/api/v2/admin/getProfile' , {
      withCredentials: true,
    });
  return response.data.data;
};

export const updateUserProfile = async (data) => {
  const response = await axiosInstance.put('/api/v2/admin/editProfile',
     data , {
    
      withCredentials: true,
  });
  return response?.data?.data;
};
export const getRevenue = async () => {
  const response = await axiosInstance.get('/api/v2/admin/revenue', {
    
      withCredentials: true,
  });
  return response.data.data;
};

export const resetUserPassword = async (passwordData) => {

  const response = await axiosInstance.post('/api/v2/auth/reset-password-with-old-password', passwordData , {
      withCredentials: true,
  });
  
  return response?.data?.data;
}


export const getforgotPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/v2/auth/forgot-password',data,{
      withCredentials: true,
  })

  return response?.data.data
}
export const submitNewPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/v2/auth/reset-password-with-otp',data,{
      withCredentials: true,
  })

  return response?.data?.data
}