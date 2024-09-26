import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { AtSign, Ellipsis, Heart, Loader2, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setUserProfile } from '@/redux/authSlice';
import { setSelectedUser } from '@/redux/chatSlice';

const Profile = () => {
  const dispatch=useDispatch();
  const params = useParams();
  const userId = params.id
  const { loading, error } = useGetUserProfile(userId);
  const { userProfile, user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const navigate=useNavigate()
  const loginUser = user?._id === userProfile?._id;
  const isFollowing=userProfile?.followers?.some(followers=>followers===user._id)

  const handleFollowUnfollow = async (id) => {
    try {
      const res = await axios.post(`https://instagram-clone-puy1.onrender.com/api/v1/user/followorunfollow/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      },{withCredentials:true})
      if (res.data.success) {
        const {updatedTarget}=res.data;


        let updatedFollowers,updatedFollowing;
        if(isFollowing){
          updatedFollowers=userProfile?.followers?.filter(uid=>uid!==user._id);
          updatedFollowing=userProfile?.following?.filter(uid=>uid!==user._id);
        }else{
          updatedFollowers=[...userProfile?.followers,user._id];
          updatedFollowing=[...userProfile?.following,updatedTarget._id];
        }

        dispatch(setUserProfile({...userProfile,followers:updatedFollowers}))
        dispatch(setAuthUser({...user,following:updatedFollowing}))
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const displayedPost = activeTab === "posts" ? userProfile?.posts : userProfile.bookmarks;


  return (<>
    {loading ? (<div className="text-center mt-5">
      <Button className="rounded-lg my-4">
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait
      </Button>
    </div>) : (<div className='flex max-w-5xl justify-center mx-auto md:pl-20 lg:pl-40'>
      <div className='flex flex-col sm:gap-20 p-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <section className="flex items-center justify-center">
            <Avatar className="h-20 w-20 sm:h-40 sm:w-40">
              <AvatarImage src={userProfile?.profilePicture} alt="post" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col sm:flex-row items-center gap-2 order-1 overflow-x-hidden'>
                <span className='text-lg'>{userProfile?.username}</span>
                {
                  loginUser ? (
                    <div className="flex gap-2">
                      <Link to="/account/edit"><Button variant="secondary" className="hover:bg-gray-200 h-8 ">edit profile</Button></Link>
                      <Button variant="secondary" className="hover:bg-gray-200 h-8 ">view archive</Button>
                      <Button className="text-gray-600 text-md font-medium bg-transparent hover:bg-transparent hidden md:block p-0 "><Ellipsis /></Button>
                    </div>
                  ) : (
                    isFollowing ? (
                      <div className="flex gap-2">
                        <Button onClick={() => handleFollowUnfollow(userProfile._id)}  variant='secondary' className="h-8">unfollow</Button>
                        <Button onClick={()=>{navigate(`/chat/${userProfile._id}`)}} variant='secondary' className="h-8">message</Button>

                      </div>
                    ) : (
                      <Button onClick={() => handleFollowUnfollow(userProfile._id)} className="bg-[#0095f6] h-8 hover:bg-[#067bc9]">follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center justify-around sm:justify-start gap-4 order-3 sm:order-2 border-t sm:border-none py-3 sm:py-1'>
                <p className='text-center'><span className='font-semibold'>{userProfile?.posts?.length}</span> posts</p>
                <p className='text-center cursor-pointer'><span className='font-semibold'>{userProfile?.followers?.length}</span> followers</p>
                <p className='text-center cursor-pointer'><span className='font-semibold'>{userProfile?.following?.length}</span> following</p>
              </div>
              <div className='flex flex-col gap-1 order-2'>
                <span className='font-medium'>{userProfile?.fullname}</span>
                <Badge className='w-fit' variant="secondary">
                  <AtSign size={13} /><span className='pl-1'>{userProfile?.username}</span>
                </Badge>
                <textarea disabled className='bg-white w-full min-h-24 resize-none text-ellipsis overflow-y-hidden' value={userProfile?.bio || "🧑 Learn code with me with practical exposure 👊DM for collaboration"}></textarea>
              </div>
            </div>
          </section>

        </div>

        <div className='border-t border-gray-200'>
          <div className='flex items-center justify-center text-sm gap-10'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? "font-medium border-t border-black" : ''}`} onClick={() => handleTabChange('posts')}>POSTS</span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? "font-medium border-t border-black" : ''}`} onClick={() => handleTabChange('saved')}>SAVED</span>
            <span className={`py-3 cursor-pointer`} >TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-2'>
            {displayedPost?.map(post =>
              <div key={post?._id} onClick={() => alert(post._id)} className='relative group cursor-pointer'>
                <img src={post.image} alt="post_img" className='rounded w-full aspect-square object-cover' />
                <div className='absolute rounded flex items-center justify-center bg-black bg-opacity-50 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex flex-col sm:flex-row items-center text-white sm:space-x-4 gap-1'>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>)}

  </>
  )
}

export default Profile
