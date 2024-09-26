import { setUserProfile } from "@/redux/authSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const  useGetUserProfile = (userId) => {
    const dispatch=useDispatch();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    // const[userProfile,setUserProfile]=useState(null)
    useEffect( () => {
        const fetchUserProfile = async () => {
            try {
                const res= await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`,{withCredentials:true})
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user))
                }

            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
        }
        fetchUserProfile();
    },[userId])
    return {loading,error};
};

export default useGetUserProfile;