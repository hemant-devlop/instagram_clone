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
        { icon: <Home />, text: "Home",title:"Home" },
        { icon: <Search />, text: "Search",title:"Search" },
        { icon: <TrendingUp />, text: "Explore",title:"Explore" },
        { icon: <MessageCircle />, text: "Messages",title:"Messages" },
        { icon: <Heart />, text: "Notifications",title:"Notifications" },
        { icon: <PlusSquare />, text: "Create",title:"Create" },
        {
            icon: (<Avatar className="w-6 h-6" >
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), text: "Profile",title:`Profile-${user?.username}`
        },
        { icon: <LogOut />, text: "Logout",title:"Logout" },
        { icon: <AlignJustify/>, text: "More",title:"More" },

    ]
    //logout func
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true })
            console.log(res)
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setPost([]))
                dispatch(setSelectedPost(null))
                navigate('/login');
                toast.success(res.data.message)
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
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                {/* <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1> */}
                 <span className='hidden'><FaInstagram/></span> {/* its hidden */}
                <div className='my-7'>
                <Link to='/'>
                  <img src="https://res.cloudinary.com/dlyqln4gb/image/upload/v1726072469/instagram_png_rlfl5i.jpg" className='h-8' alt="instagram" />  
                  </Link>
                </div>
                <div className='flex flex-col'>
                {sidebarItems.map((item, index) =>
                <TooltipProvider key={index} >
                <Tooltip >
                    <TooltipTrigger>
                        <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-1'>
                            {item.icon}<span>{item.text}</span>
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
