import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { IoLogoFacebook } from "react-icons/io";

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {user}=useSelector(store=>store.auth)



    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const signInHandler = async (e) => {
        e.preventDefault();
        // console.log(input)
        try {
            setLoading(true);
            const res = await axios.post('https://instagram-clone-puy1.onrender.com/api/v1/user/login', input, {
                headers: {
                    "Content-Type": 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate('/')
                toast.success(res.data.message,{duration:2000,});
                setInput({
                    email: '',
                    password: ''
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data?.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(user){
            navigate('*')
        }
    },[])
    return (
        <div className='flex items-center w-screen h-screen justify-center'>
          <div className="max-w-[360px] min-w-[350px] border flex items-center justify-center">
            <form onSubmit={signInHandler} className='shadow-lg flex flex-col p-8 w-full'>
            <div className='my-4'>
                        <div className='flex items-center justify-center my-2'>
                            <img src="https://res.cloudinary.com/dlyqln4gb/image/upload/v1726072469/instagram_png_rlfl5i.jpg" className='h-12' alt="instagram" />
                        </div>
                    </div>
                <div>
                    <Input type="text" name="email" value={input.email} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2 rounded bg-slate-50" placeholder="email" />
                </div>
                <div>
                    <Input type="password" name="password" value={input.password} onChange={changeEventHandler} className="focus-visible:ring-transparent my-2 rounded bg-slate-50" placeholder="password" />
                </div>
                {loading ? <Button className="rounded-lg my-4">
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />please wait
                </Button> :
                    <Button type='submit' className="rounded-lg my-4">Login</Button>
                }

                    <div className="flex items-center justify-center my-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500 font-medium text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <Button type="button" className="rounded-lg text-sm bg-transparent text-black hover:bg-transparent" onClick={()=>{console.log('feature not available')}}>
                        <IoLogoFacebook className='text-xl mr-1 text-black' />
                        Log in with Facebook</Button>
                       <span className='text-center text-sm cursor-pointer py-5'>forgot password?</span>
                <span className='text-center'>Don't have an account? <Link to="/signup" className='text-blue-600'>Sign up</Link></span>

            </form>
            </div>
        </div>
    )
}

export default Login;
