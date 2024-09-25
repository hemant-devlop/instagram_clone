import React from 'react'
import Posts from './Posts'
import StoryFeed from './StoryFeed'

const Feed = () => {
  return (
    <div className='flex-1 my-2 flex items-center flex-col px-5 sm:pl-[20%] min-w-[300px] '>
      <StoryFeed/>
      <Posts />
    </div>
  )
}

export default Feed
