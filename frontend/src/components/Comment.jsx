import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const Comment = ({singleComment}) => {
    console.log(singleComment)
  return (
    <div>
      <div className='flex gap-3 justify-start mb-3'>
        <Avatar>
            <AvatarImage src={singleComment?.author.profilePicture} alt="profile"/>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className='font-medium'>{singleComment?.author.username} <span className='pl-1 font-normal leading-3 text-sm'>{singleComment.text}</span></h1>
      </div>
    </div>
  )
}

export default Comment
