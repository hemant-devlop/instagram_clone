import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex items-center flex-col px-5 sm:pl-[20%] min-w-[300px] '>
      <Posts/>
    </div>
  )
}

export default Feed
