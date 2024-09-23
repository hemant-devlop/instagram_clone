import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MessageCircleCode } from 'lucide-react'
import { setSelectedUser } from '@/redux/chatSlice'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FaInstagram } from 'react-icons/fa'


const ChatMenu = () => {
    const { user, suggestedUsers } = useSelector(store => store.auth)
    const { onlineUsers } = useSelector(store => store.chat)
    const dispatch = useDispatch();
    const location=useLocation();
    const currentPath=location.pathname;
    
    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedUser(null))
        }
    },[])
    return (
        <div className='flex sm:ml-[80px] lg:ml-[16%] h-screen'>
            <section className='sm:w-1/2 md:w-1/4'>
                <h1 className='hidden sm:block font-bold my-4 px-3 text-xl '>{user?.username}</h1>
                <span className='sm:hidden flex items-center justify-center p-3'><FaInstagram size={'25px'} /></span>
                <hr className='mb-4 border-gray-300 ' />
                <div className='overflow-y-auto h-[80vh]'>
                
                    {
                        suggestedUsers.map((suggestedUser) => {
                           const isOnline=onlineUsers.includes(suggestedUser?._id);
                            return (
                                <Link to={`/chat/${suggestedUser._id}`} key={suggestedUser._id} >
                                <div onClick={() => {
                                    dispatch(setSelectedUser(suggestedUser));
                                    
                                }}  className='flex items-center p-3 gap-3 hover:bg-gray-100 cursor-pointer'>
                                    <Avatar className="sm:h-14 sm:w-14">
                                        <AvatarImage src={suggestedUser?.profilePicture} alt="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='hidden sm:flex flex-col'>
                                        <span className="font-medium">{suggestedUser?.fullname}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-600'}`} >{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </section>
            <Outlet/>
            {currentPath === '/chat' && <div className='flex flex-col items-center justify-center mx-auto'>
                    <MessageCircleCode className='w-32 h-32 my-4' />
                    <h1 className='font-semibold text-xl'>Your messages</h1>
                    <span>send a message for start a chat</span>
                </div>}
        </div>
    )
}

export default ChatMenu;
