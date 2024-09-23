import React, { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPost } from '@/redux/postSlice'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { debounce } from 'lodash'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post)
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments);
        }
    }, [selectedPost]);
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    const debounceComment = useCallback(debounce(async (id,commentText) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${id}/comment`, { text:commentText }, {
                headers: {
                    'content-type': 'application/json',
                },
                withCredentials: true
            })
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map(postData => postData._id === selectedPost._id ? { ...postData, comments: updatedCommentData } : postData)
                dispatch(setPost(updatedPostData))
                toast.success(res.data.message,{duration:2000,});
                setText("");
            }
        } catch (error) {
            console.log(error)
        }
    },1000),[comment, posts, selectedPost?._id, dispatch])
    // console.log(debounceComment())

    //inside post comment hadler
    const sendMessageHandler = async () => {
       debounceComment(selectedPost._id,text)
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col">
                <VisuallyHidden>
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                </VisuallyHidden>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img src={selectedPost?.image}
                            alt="post_img"
                            className='h-full w-full aspect-square object-cover rounded-l-lg' />
                    </div>
                    <div className='w-1/2 flex flex-col '>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-sm'>{selectedPost?.author?.username}</Link>
                                    {/* <span className='text-gray-600 text-sm'>bio here</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col text-sm items-center text-center">
                                    <VisuallyHidden>
                                        <DialogTitle></DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </VisuallyHidden>
                                    <div className='w-full cursor-pointer font-bold text-[#ED4956] '>Unfollow</div>
                                    <div className='w-full cursor-pointer'>add to favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            <div className='flex gap-3 justify-start mb-3'>
                                <Avatar>
                                    <AvatarImage src={selectedPost?.author?.profilePicture} alt="profile" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1 className='font-medium'>{selectedPost?.author?.username} <span className='pl-1 font-normal leading-3 text-sm'>{selectedPost?.caption}</span></h1>
                            </div>
                            {
                                comment?.map(singleComment => <Comment key={singleComment._id} singleComment={singleComment} />)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type="text" value={text} onChange={changeEventHandler} placeholder='add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>post</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
