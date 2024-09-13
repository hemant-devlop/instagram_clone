import { AlignJustify, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { FaInstagram } from 'react-icons/fa'
import { setPost, setSelectedPost } from '@/redux/postSlice'
// import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'


const LeftSideBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth)
    const [open, setOpen] = useState(false);

    const sidebarItems = [
        { icon: <Home />, text: "Home", title: "Home", bottombar: true, order: 1 },
        { icon: <Search />, text: "Search", title: "Search" },
        { icon: <TrendingUp />, text: "Explore", title: "Explore", bottombar: true, order: 2 },
        { icon: <MessageCircle />, text: "Messages", title: "Messages", bottombar: true, order: 4 },
        { icon: <Heart />, text: "Notifications", title: "Notifications" },
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


    //logout func
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setPost([]))
                dispatch(setSelectedPost(null))
                navigate('/login');
                toast.success(res.data.message,{duration:2000,})
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    //create post func
    //side bar handler
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true)
        }

    }

    return (
        <div className='flex flex-col fixed bottom-0 sm:top-0 bg-white z-40 left-0  px-4 border-r border-gray-300  h-14 w-screen sm:min-w-[80px] sm:w-[16%] sm:h-screen '>
            <div className='hidden sm:block my-7 w-full sm:w-auto mx-auto'>
                <Link to='/'>
                    <span className='hidden sm:block lg:hidden p-3'><FaInstagram size={'25px'} /></span>
                    <img src="https://res.cloudinary.com/dlyqln4gb/image/upload/v1726072469/instagram_png_rlfl5i.jpg" className='h-8 hidden lg:block' alt="instagram" />
                </Link>
            </div>
            <div className='flex flex-row sm:flex-col w-full items-center sm:items-start justify-center sm:justify-start'>
                {/* <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1> */}
                <div className="flex flex-row sm:flex-col justify-between  w-full ">
                    {sidebarItems.map((item, index) =>
                        <TooltipProvider key={index} >
                            <Tooltip >
                                <TooltipTrigger>
                                    <div onClick={() => sidebarHandler(item.text)} key={index} className={`flex items-center justify-center lg:justify-start gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-1 ${item.bottombar ? 'block sm:flex' : 'hidden sm:flex'} `}>
                                        {item.icon}<span className='hidden lg:block'>{item.text}</span>
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
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSideBar
