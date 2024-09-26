import React, { useCallback, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Messages from './Messages'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setMessages, setSelectedUser } from '@/redux/chatSlice'
import { MessageCircleCode } from 'lucide-react'
import { debounce } from 'lodash'


const ChatConversation = () => {
    const dispatch = useDispatch();
    const [textMessage, setTextMessage] = useState("");
    const [isLoading,setIsLoading]=useState(true);
    const { selectedUser, onlineUsers, messages } = useSelector(store => store.chat)
    const isOnline = onlineUsers.includes(selectedUser?._id);

    const debounceMessage = useCallback(debounce(async (receiverId,message) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { message }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]))
                setTextMessage('');
            }

        } catch (error) {
            console.log(error)
        }
    },1000),[messages,dispatch])

    const sendMessageHander = async (receiverId) => {
        if (!textMessage.trim()) {
            console.log('message box cannot be empty');
            return;
        }
        debounceMessage(receiverId,textMessage)

    }
    return (<>
        {selectedUser ? (
            <section className='flex flex-col flex-1 h-[100vh] border-l border-l-gray-300 overflow-y-auto'>
                <div className='flex gap-3 item-center px-3 py-2 border-b border-b-gray-300 sticky top-0 bg-white z-10 h-16'>
                    <Avatar className="h-11 w-11">
                        <AvatarImage src={selectedUser?.profilePicture} alt="" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-center'>
                        <span className='font-semibold'>{selectedUser?.fullname}</span>
                        <span className={`pl-2 text-sm text-green-600 ${!isOnline && 'hidden'}`}>active now</span>
                    </div>
                </div>
                <Messages selectedUser={selectedUser} />
                <div className='flex items-center m-4 p-1 sm:p-1 border rounded-full  mb-12 sm:mb-2'>
                    <Input type="text" value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className='flex-1 focus-visible:ring-transparent mr-2 border-none rounded-full' placeholder='message....' />
                    <Button variant="none" className="text-[#3797f0]"  onClick={() => sendMessageHander(selectedUser?._id)} disabled={!textMessage.trim()}>send</Button>
                </div>

            </section>) : (
            <div className='flex flex-col items-center justify-center mx-auto'>
                <MessageCircleCode className='w-32 h-32 my-4' />
                <h1 className='font-semibold text-xl'>Your messages</h1>
                <span>send a message for start a chat</span>
            </div>
        )
        }
    </>

    )
}

export default ChatConversation