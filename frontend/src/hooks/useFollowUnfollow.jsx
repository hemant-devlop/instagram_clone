import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { toast } from "sonner";

const useFollowUnfollow = () => {
  const [loading, setLoading] = useState(false);
  const {user,userProfile}=useSelector(store=>store.auth)
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const isFollowing=userProfile?.followers?.some(followers=>followers===user._id)
  
  const followUnfollow = async (userId) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
        const res = await axios.post(`https://instagram-clone-puy1.onrender.com/api/v1/user/followorunfollow/${userId}`,{}, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials:true
        })
        if (res.data.success) {
          const {updatedTarget}=res.data;
  
  
          let updatedFollowers,updatedFollowing;
          if(isFollowing){
            //unfollow
            updatedFollowers=userProfile?.followers?.filter(uid=>uid!==user._id);
            updatedFollowing=userProfile?.following?.filter(uid=>uid!==user._id);
          }else{
            //follow
            updatedFollowers=[...userProfile?.followers,user._id];
            updatedFollowing=[...userProfile?.following,updatedTarget._id];
          }
  
          dispatch(setUserProfile({...userProfile,followers:updatedFollowers}))
          dispatch(setAuthUser({...user,following:updatedFollowing}))

          toast.success(res.data.message)
        }
  
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to follow/unfollow.');
        console.log(error)
      }
  };

  return { followUnfollow, loading, error,isFollowing };
};

export default useFollowUnfollow;
