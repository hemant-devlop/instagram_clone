import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { IoLogoFacebook } from "react-icons/io";

const Signup = () => {
    const [input, setInput] = useState({
        username: '',
        fullname:'',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const signupHandler = async (e) => {
        e.preventDefault();
        // console.log(input)
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message,{duration:2000,});
                setInput({
                    username: '',
                    fullname:'',
                    email: '',
                    password: ''
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }
    return (<>
        <div className='flex items-center w-screen h-screen justify-center overflow-x-hidden'>
            <div className="max-w-[360px] min-w-[350px] border flex items-center justify-center">
                <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-3 p-10'>
                    <div className='my-4'>
                        <div className='flex items-center justify-center my-2'>
                            <img src="https://res.cloudinary.com/dlyqln4gb/image/upload/v1726072469/instagram_png_rlfl5i.jpg" className='h-12' alt="instagram" />
                        </div>
                        <p className='font-semibold text-sm text-center text-gray-600 px-5'>Sign up to see photos and videos from your friends.</p>
                    </div>
                    <Button type="button" className="rounded-lg text-sm">
                        <IoLogoFacebook className='text-xl mr-1' />
                        Log in with Facebook</Button>

                    <div className="flex items-center justify-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 font-medium text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div>
                        {/* <Label>Email</Label> */}
                        <Input type="email" name="email" value={input.email} onChange={changeEventHandler} className="focus-visible:ring-transparent rounded bg-slate-50" placeholder="email"/>

                    </div>
                    <div>
                        {/* <Label>Full Name</Label> */}
                        <Input type="text" name="fullname" value={input.fullname.charAt(0).toUpperCase() + input.fullname.slice(1)} onChange={changeEventHandler} className="focus-visible:ring-transparent rounded bg-slate-50" placeholder="Fullname" />
                    </div>
                    <div>
                        {/* <Label>Username</Label> */}
                        <Input type="text" name="username" value={input.username} onChange={changeEventHandler} className="focus-visible:ring-transparent rounded bg-slate-50" placeholder="username" />
                    </div>
                    <div>
                        {/* <Label>Password</Label> */}
                        <Input type="text" name="password" value={input.password} onChange={changeEventHandler} className="focus-visible:ring-transparent rounded bg-slate-50" placeholder="password" />
                    </div>
                    <span className='text-xs text-gray-600 py-2'>
                    People who use our service may have uploaded your contact information to Instagram. <Link className='text-black'>Learn More</Link>
                    </span>
                    {loading ? <Button className="rounded-xl text-sm">
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait
                    </Button> :
                        <Button type='submit' className={`rounded-lg text-sm ${input.email ==='' && "bg-[#4d4d4d]"}`} >Sign Up</Button>
                    }
                    <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>login</Link></span>

                </form>
            </div>
        </div>
        </>
    )
}

export default Signup
