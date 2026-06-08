import axiosInstance from "../../../config/axiosConfig";




export const fetchAllRevenueHistory = async()=>{
    const response = await axiosInstance.get('/api/v2/admin/allRevenue',{withCredentials:true})
    return response?.data?.data;
}