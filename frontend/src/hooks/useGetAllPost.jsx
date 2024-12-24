import { setPost } from "@/redux/postSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const useGetAllPost = () => {
    const dispatch=useDispatch();
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState(null);
    useEffect( () => {
        const fetchPost = async () => {
            try {
                const res= await axios.get('http://localhost:8000/api/v1/post/all',{withCredentials:true})
                if(res.data.success){
                    dispatch(setPost(res.data.posts))
                }

            } catch (error) {
                setError(error)
            }finally{
                setLoading(false)
            }
        }
        fetchPost();
    },[])
    return {loading,error};
};

export default useGetAllPost;