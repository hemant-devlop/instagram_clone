import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { MessageCircleCode } from 'lucide-react'
import { setSelectedUser } from '@/redux/chatSlice'

const ChatPage = () => {
    const { user, suggestedUsers } = useSelector(store => store.auth)
    const {selectedUser}=useSelector(store=>store.chat)
    const isActive = true;
    const dispatch = useDispatch();
    return (
        <div className='flex sm:ml-[80px] lg:ml-[16%] h-screen'>
            <section>
                <h1 className='font-semibold mb-4 px-3 text-xl '>{user?.username}</h1>
                <hr className='mb-4 border-gray-300 ' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) =>{
                            return(
                                <div onClick={()=>dispatch(setSelectedUser(suggestedUser))}  key={suggestedUser._id} className='flex items-center p-3 gap-3 hover:bg-gray-50 cursor-pointer'>
                                <Avatar >
                                    <AvatarImage src={suggestedUser?.profilePicture} alt="" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className="font-medium">{suggestedUser?.username}</span>
                                    <span className={`text-xs font-bold ${isActive ? 'text-green-600' : 'text-gray-600'}`} >{isActive ? 'online' : 'offline'}</span>
                                </div>
                            </div>
                            )
                        })
                    }
                </div>
            </section>
            {
                selectedUser?(
                    <section className='flex flex-col flex-1 h-full border-l border-l-gray-300'>
                        <div className='flex gap-3 item-center px-3 py-2 border-b border-b-gray-300 sticky top-0 bg-white z-10'>
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt=""/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span>{selectedUser?.username}</span>
                            </div>
                        </div>
                        messagesss
                        <div className='flex items-center p-4 border-t border-t-gray-300'>
                    <Input type="text" className='flex-1 focus-visible:ring-transparent mr-2' placeholder='message....' />
                    <Button>send</Button>
                        </div>
                    </section>
                ):(<div className='flex flex-col items-center justify-center mx-auto'>
                    <MessageCircleCode className='w-32 h-32 my-4'/>
                    <h1 className='font-semibold text-xl'>Your messages</h1>
                    <span>send a message for start a chat</span>
                </div>)
            
            }
        </div>
    )
}

export default ChatPage
