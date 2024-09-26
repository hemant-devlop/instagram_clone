
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetAllMessages from '@/hooks/useGetAllMessages'
import { useSelector } from 'react-redux'
import useGetRTM from '@/hooks/useGetRTM'
import { Loader2 } from 'lucide-react'

const Messages = ({ selectedUser }) => {
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const messageFocus = useRef(null);

    useEffect(() => {
        if (messageFocus.current) {
            messageFocus.current.scrollIntoView({ behavior: 'smooth' });
        }


    }, [messages])


    useGetRTM();
    const { loading, error } = useGetAllMessages();
    return (
        <div className='overflow-y-auto flex-1 p-4'>
            <div className='flex justify-center'>
                {/* profile photo and view profile  */}
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser?.profilePicture} alt="" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold'>{selectedUser?.fullname}</span>
                    <span className='text-sm'>{selectedUser?.username} • instagram</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className="h-8 my-2" variant="secondary">view profile</Button>
                    </Link>
                </div>
                {/* messages */}
            </div>
            <div className='flex flex-col gap-4'>
                {loading ? <div className="text-center mt-5">
                    <Button variant="link" className="rounded-lg my-4">
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait
                    </Button>
                </div>:(
                    messages && messages?.map((msg, index) => <div key={index} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'} `}>
                        <div className={`flex ${msg.senderId === user._id ? 'hidden' : 'justify-start items-center'} h-10 w-10 `}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={selectedUser?.profilePicture} alt="" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className={`px-3 py-1 rounded-[18px] text-md ${msg.senderId === user._id ? 'bg-[#3797f0] text-white' : 'bg-[#efefef]'} ${index === messages.length - 1 ? 'animate-fade' : ''}`}>
                            {msg?.message}
                        </div>
                    </div>)

                )}
                <div ref={messageFocus} />
            </div>
        </div>
    )
}

export default Messages
