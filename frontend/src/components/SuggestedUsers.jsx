import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth)
    return (
        <div className='my-10 '>
            <div className='flex items-center justify-between mb-5'>
                <h1 className='font-semibold text-sm text-gray-600'>Suggested for you</h1>
                <span className='font-medium text-sm cursor-pointer hover:text-gray-600'>See All</span>
            </div>
            {
                suggestedUsers.map(user => 
                <div key={user._id} className='flex items-center justify-between my-2'>
                    <div className='flex items-center gap-2 cursor-pointer'>
                        <Link to={`/profile/${user?._id}`}>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="post" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                        <Link to={`/profile/${user?._id}`} >
                            <h1 className='font-semibold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'bio here...'}</span>
                        </Link>
                    </div>
                    <span className='text-[#3badf8] cursor-pointer font-bold text-xs hover:text-[#3190cf]'>follow</span>
                </div>
                )
            }
        </div>
    )
}

export default SuggestedUsers
