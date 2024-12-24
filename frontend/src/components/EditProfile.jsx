import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setAuthUser } from '@/redux/authSlice'
import { readFileAsDataURL } from '@/lib/utils'

const EditProfile = () => {
    const [isloading, setIsloading] = useState(false);
    const selectProfileImage = useRef();
    const { user } = useSelector(store => store.auth)
    const [imgPreview, setImgPreview] = useState("")


    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        fullname: user?.fullname,
        bio: user?.bio,
        gender: user?.gender,
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const fileChangeHandler =async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, profilePhoto: file, });
            const dataUrl = await readFileAsDataURL(file);
            setImgPreview(dataUrl)
            toast.success("Profile image selected")
        }
    }
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value })
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append('bio', input.bio)
        formData.append('fullname', input.fullname)
        formData.append('gender', input.gender)
        if (input.profilePhoto) {
            formData.append('profilePicture', input.profilePhoto)
        }

        try {
            setIsloading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    fullname: res.data.user?.fullname,
                    gender: res.data.user?.gender
                }
                dispatch(setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setIsloading(false)
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto sm:pl-20 p-5'>
            <section className='flex flex-col gap-6 w-full my-10'>
                <h1 className='font-semibold text-lg'>edit profile</h1>
                <div className='flex items-center justify-between rounded-[20px] bg-gray-100 p-4 w-full'>
                    <div className='flex items-center gap-3 cursor-pointer'>
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={imgPreview?imgPreview:user?.profilePicture} alt="post" />
                            <AvatarFallback >CN</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col sm:flex-row items-center sm:gap-52'>
                            <div >
                                <h1 className='font-semibold '>{user?.username}</h1>
                                <span className='text-gray-600 text-sm hidden sm:block '>{user?.fullname}</span>
                            </div>
                            <div >
                                <input ref={selectProfileImage} onChange={fileChangeHandler} type="file" className='hidden' />
                                <Button onClick={() => selectProfileImage.current.click()} className="text-sm p-0 bg-transparent text-[#0095F6] sm:text-white sm:px-3 hover:bg-transparent  hover:text-gray-600 sm:hover:text-white sm:bg-[#0095F6] sm:hover:bg-[#0180d5] h-8">Change photo</Button>
                            </div>
                        </div>
                    </div>

                </div>
                <div>
                    <h1 className='font-semibold text-lg mb-2'>Full name</h1>
                    <Input type="text" value={input?.fullname} name="fullname" onChange={(e) => setInput({ ...input, fullname: e.target.value })} className="focus:border-black focus-visible:ring-transparent" />
                </div>
                <div>
                    <h1 className='font-semibold text-lg mb-2'>Bio</h1>
                    <Textarea value={input?.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name="bio" className=" resize-none focus-visible:ring-transparent " placeholder="Bio">
                    </Textarea>
                </div>
                <div>
                    <h1 className='font-semibold text-lg mb-2'>Gender</h1>
                    <Select defaultValue={input?.gender} onValueChange={selectChangeHandler} >
                        <SelectTrigger className="focus:outline-none focus-visible:ring-0" >
                            <SelectValue placeholder="Prefer not to say"></SelectValue>
                        </SelectTrigger>
                        <SelectContent className="w-[200px]">
                            <SelectGroup>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="Perfer not to say">Perfer not to say</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center justify-end'>
                    {
                        isloading ? <Button className="w-40 bg-[#0095F6] hover:bg-[#0180d5] ">
                            <Loader2 />
                            please wait
                        </Button> :
                            <Button onClick={editProfileHandler} className="w-40 bg-[#0095F6] hover:bg-[#0180d5] ">submit</Button>
                    }
                </div>

            </section>
        </div>
    )
}

export default EditProfile
