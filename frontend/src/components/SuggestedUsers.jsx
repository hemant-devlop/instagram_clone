import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MessageCircle } from 'lucide-react'
import { setSelectedUser } from '@/redux/chatSlice'
import { Dialog, DialogContent,DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth)
    const navigate = useNavigate();


    const handleGetProfile = (userId) => {
        navigate(`/profile/${userId}`);
       
    }
    return (
        <div className='my-10 '>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-semibold text-sm text-gray-600'>Suggested for you</h1>
                <span className='font-medium text-sm cursor-pointer hover:text-gray-600'>See All</span>
            </div>
            {
                suggestedUsers?.map(user =>
                    <div key={user._id} className='flex items-center justify-between my-2'>
                        <div className='flex items-center gap-2 cursor-pointer'>
                            <Avatar onClick={() => handleGetProfile(user._id)}>
                                <AvatarImage src={user?.profilePicture} alt="post" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className='leading-none' onClick={() => handleGetProfile(user._id)}>
                                <h1 className='font-semibold text-sm'>{user?.username}</h1>
                                <span className='text-gray-600 text-xs'>{user?.fullname || 'bio here...'}</span>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger>
                        <span className='text-[#3badf8] cursor-pointer font-bold text-xs hover:text-[#3190cf]'>follow</span>
                            </DialogTrigger>
                            <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant="ghost" className='cursor-pointer w-fit text-[#ed4956] font-bold rounded' >follow</Button>
                        <Button variant="ghost" className='cursor-pointer w-fit font-bold rounded'>cancel</Button>
                    </DialogContent>
                        </Dialog>
                    </div>
                )
            }
        </div>
    )
}

export default SuggestedUsers
