
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const  useGetAllSuggestedUsers = () => {
    const dispatch=useDispatch();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    useEffect( () => {
        const fetchSuggestedUsers = async () => {
            try {
                const res= await axios.get('http://localhost:8000/api/v1/user/suggested',{withCredentials:true})
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users))
                }

            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
        }
        fetchSuggestedUsers();
    },[])
    return {loading,error};
};

export default useGetAllSuggestedUsers;