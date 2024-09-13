import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='w-[25%] my-10 pr-4 hidden my-10 lg:block'>
      <div className='flex items-center gap-2 cursor-pointer'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <Link to={`/profile/${user?._id}`} >
          <h1 className='font-semibold text-sm'>{user?.username}</h1>
        </Link>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar
