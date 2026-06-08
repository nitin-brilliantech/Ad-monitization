import axiosInstance from "../../../config/axiosConfig";

export const registerUserApi= async(data)=>{
  const response = await axiosInstance.post(
        "/api/v1/auth/createUser",
        data,
        {
          withCredentials: true,
        }
      );
  return response.data;
};

export const loginUserApi = async (credentials) => {
  const response = await axiosInstance.post(
    `/api/v1/auth/login`,
    credentials
  );
  return response.data?.data;
};

export const getUserProfileAPI = async () => {
  const response = await axiosInstance.get('/api/v1/users/myProfile' , {
      withCredentials: true,
    });
  return response.data?.data;
};

export const updateUserProfileAPI = async (data) => {
  
  const response = await axiosInstance.put('/api/v1/users/editProfile', data , {
      withCredentials: true,
  });
  return response.data;
};

export const resetUserPasswordAPI = async (passwordData) => {

  const response = await axiosInstance.post('/api/v1/auth/reset-password', passwordData , {
      withCredentials: true,
  });
  
  return response.data;
}


export const getforgotPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/v1/auth/forgot-password',data,{
      withCredentials: true,
  })

  return response.data
}
export const submitNewPassOTP= async (data)=>{
  const response = await axiosInstance.post('/api/v1/auth/reset-password-otp',data,{
      withCredentials: true,
  })

  return response.data
}