import { AlignJustify, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip'
import { FaInstagram } from 'react-icons/fa'
import { setPost, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { resetLikeNotification, setLikeNotification } from '@/redux/rtnSlice'


const LeftSideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const [open, setOpen] = useState(false);

    const sidebarItems = [
        { icon: <Home />, text: "Home", title: "Home", bottombar: true, order: 1 },
        { icon: <Search />, text: "Search", title: "Search" },
        { icon: <TrendingUp />, text: "Explore", title: "Explore", order: 2 },
        { icon: <MessageCircle />, text: "Messages", title: "Messages", bottombar: true, order: 4 },
        { icon: <Heart />, text: "Notifications", title: "Notifications", bottombar: true },
        { icon: <PlusSquare />, text: "Create", title: "Create", bottombar: true, order: 3 },
        {
            icon: (<Avatar className="w-6 h-6" >
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), text: "Profile", title: `Profile-${user?.username}`, bottombar: true, order: 6
        },
        { icon: <LogOut />, text: "Logout", title: "Logout", bottombar: true, order: 5 },
        { icon: <AlignJustify />, text: "More", title: "More" },

    ]

    const bottomItems = sidebarItems.filter((item) => item.bottombar === true)


    //logout func
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setPost([]))
                dispatch(setSelectedPost(null))
                dispatch(resetLikeNotification())
                navigate('/login');
                toast.success(res.data.message, { duration: 2000, })
            }
        } catch (error) {
            toast.error(error.response.data?.message)
        }
    }
    //create post func
    //side bar handler
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true)
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`)
        } else if (textType === "Home") {
            navigate('/')
        } else if (textType === "Messages") {
            navigate('/chat')
        }

    }
    
    return (
        <div className='flex flex-col justify-center fixed bottom-0 sm:top-0 bg-white sm:bg-transparent z-40 left-0 sm:px-4 pr-2 drop-shadow-2xl sm:drop-shadow-none border-r border-gray-300  h-11 w-screen sm:min-w-[80px] sm:w-[80px] lg:w-[16%] sm:h-screen'>
            <div className='hidden sm:block my-7 w-full sm:w-auto mx-auto '>
                <Link to='/'>
                    <span className='hidden sm:block lg:hidden p-3'><FaInstagram size={'25px'} /></span>
                    <img src="https://res.cloudinary.com/dlyqln4gb/image/upload/v1726072469/instagram_png_rlfl5i.jpg" className='h-8 hidden lg:block' alt="instagram" />
                </Link>
            </div>
            <div className='flex flex-row sm:flex-col w-full items-center sm:items-start justify-center sm:justify-start'>
                <div className="hidden sm:flex sm:flex-col w-full">
                    {sidebarItems.map((item, index) =>
                        <TooltipProvider key={index} >
                            <Tooltip >
                                <TooltipTrigger>
                                    <div onClick={() => sidebarHandler(item.text)} key={index} className={`flex items-center justify-center lg:justify-start gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-1  `}>
                                        {item.icon}<span className='hidden lg:block'>{item.text}</span>
                                        {
                                            item.text === "Notifications" && likeNotification.length > 0 && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <span size='icon' className="flex items-center justify-center rounded-full font-medium text-white bg-red-600 hover:bg-red-600 h-5 w-5 absolute bottom-6 left-6">{likeNotification.length}</span>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <div>
                                                            {
                                                                likeNotification.length === 0 ? (<p>no new notification</p>) : (
                                                                    likeNotification.map((notification,index) => <div key={index} className='flex items-center gap-3 py-3'>
                                                                        <Avatar>
                                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <p className='text-sm '><span className='font-semibold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                    </div>)
                                                                )
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <span className='font-medium'>
                                        {item.title}
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                <div className="flex items-center justify-between sm:hidden w-full px-[20px]">
                    {bottomItems.map((item, index) =>
                        <TooltipProvider key={index} >
                            <Tooltip >
                                <TooltipTrigger>
                                    <div onClick={() => sidebarHandler(item.text)} className={`flex items-center justify-center lg:justify-start gap-4 relative sm:hover:bg-gray-100 cursor-pointer rounded-lg p-0 my-1 ${item.bottombar ? 'block sm:flex' : 'hidden sm:flex'} `}>
                                        {item.icon}
                                        {
                                            item.text === "Notifications" && likeNotification.length > 0 && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <span size='icon' className="flex items-center justify-center rounded-full font-medium text-white bg-red-600 hover:bg-red-600 h-5 w-5 absolute bottom-3 left-3">{likeNotification.length}</span>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <div>
                                                            {
                                                                likeNotification.length === 0 ? (<p>no new notification</p>) : (
                                                                    likeNotification.map((notification,index) => <div key={index} className='flex items-center gap-3 py-3'>
                                                                        <Avatar>
                                                                            <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                            <AvatarFallback>CN</AvatarFallback>
                                                                        </Avatar>
                                                                        <p className='text-sm '><span className='font-semibold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                    </div>)
                                                                )
                                                            }
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )
                                        }
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <span className='font-medium'>
                                        {item.title}
                                    </span>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSideBar
