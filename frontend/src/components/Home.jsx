import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetAllSuggestedUsers from '@/hooks/useGetAllSuggestedUsers'

const Home = () => {
 useGetAllPost();
 useGetAllSuggestedUsers();
  return (
    <div className='flex'>
      <div className='flex-grow overflow-x-hidden'>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
