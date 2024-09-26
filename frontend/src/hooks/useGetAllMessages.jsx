import { setMessages } from "@/redux/chatSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetAllMessages = () => {
    const {selectedUser} =useSelector(store=>store.chat)
    const dispatch=useDispatch();
    const[loading,setLoading]=useState(null);
    const[error,setError]=useState(null);
    useEffect( () => {
        const fetchAllMessages = async () => {
            try {
                setLoading(true)
                const res= await axios.get(`https://instagram-clone-puy1.onrender.com/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setMessages(res.data.messages))
                }

            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
        }
        fetchAllMessages();
    },[selectedUser])
    return {loading,error};
};

export default useGetAllMessages;