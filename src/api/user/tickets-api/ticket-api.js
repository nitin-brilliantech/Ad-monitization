import axiosInstance from "../../../config/axiosConfig"



export const createTicketAPI=async(data)=>{
const response = axiosInstance.post('/api/v1/ticket/createTicket',data)
return response.data
}