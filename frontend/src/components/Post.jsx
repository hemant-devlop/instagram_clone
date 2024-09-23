import React, { useCallback, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiSmile } from "react-icons/fi";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPost, setSelectedPost } from '@/redux/postSlice'
import moment from 'moment'
import { Badge } from './ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'

const Post = ({ post }) => {
    const { createdAt } = post;
    const [text, setText] = useState('');
    const [open, setOpen] = useState(false)
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const { selectedPost } = useSelector(store => store.post);
    // console.log(selectedPost.author._id)
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
    const [active, setActive] = useState(false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments)
    const navigate = useNavigate();


    const formatTimeAgo = (createdAt) => {
        const now = moment();
        const created = moment(createdAt);
        const duration = moment.duration(now.diff(created));

        if (duration.asSeconds() < 60) {
            return `${Math.floor(duration.asSeconds())}s`; // seconds
        } else if (duration.asMinutes() < 60) {
            return `${Math.floor(duration.asMinutes())}m`; // minutes
        } else if (duration.asHours() < 24) {
            return `${Math.floor(duration.asHours())}h`; // hours
        } else if (duration.asDays() < 7) {
            return `${Math.floor(duration.asDays())}d`; // days
        } else if (duration.asWeeks() < 4) {
            return `${Math.floor(duration.asWeeks())}w`; // weeks
        } else {
            return created.format('MMM D'); // fallback to a more readable format
        }
    };
    const timeAgo = formatTimeAgo(createdAt);

    const debouncePostComment = useCallback(debounce(async (id,commentText) => {
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
                
                const updatedPostData = posts?.map(postData => postData._id === post._id ? { ...postData, comments: updatedCommentData } : postData)
                dispatch(setPost(updatedPostData))
                toast.success(res.data.message, { duration: 2000, });
                setText("");
            }
        } catch (error) {
            console.log(error)
        }
    },1000),[comment, posts, post?._id, dispatch])
    //post comment func
    const handleComments = async () => {
        // try {
        //     const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
        //         headers: {
        //             'content-type': 'application/json',
        //         },
        //         withCredentials: true
        //     })
        //     if (res.data.success) {
        //         const updatedCommentData = [...comment, res.data.comment]
        //         setComment(updatedCommentData)

        //         const updatedPostData = posts?.map(postData => postData._id === post._id ? { ...postData, comments: updatedCommentData } : postData)
        //         dispatch(setPost(updatedPostData))
        //         toast.success(res.data.message, { duration: 2000, });
        //         setText("");
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
        debouncePostComment(post._id,text)
    }
    //post like n unlike func
    const likeUnlikePost = async () => {
        try {
            const action = liked ? "dislike" : "like";
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;

                setPostLike(updatedLikes)

                setLiked(!liked);
                setActive(true)

                const updatepostData = posts?.map(postdata => postdata._id === post._id ? {
                    ...postdata, likes: liked ? postdata.likes.filter(id => id !== user._id) : [...postdata.likes, user._id]
                } : postdata);
                dispatch(setPost(updatepostData));

                toast.success(res.data.message, { duration: 2000, });
            }

        } catch (error) {
            console.log(error)
        }
    }
    //delete post func
    const debounceDeletePost = useCallback(debounce(async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPosts = posts.filter(postItem => postItem._id !== post._id);
                dispatch(setPost(updatedPosts));
                toast.success(res.data.message, { duration: 2000, });
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    },1000),[posts,post?._id, dispatch])

    const deletePostHandler = async () => {
        debounceDeletePost(post?._id)
    }
    //adding comment in post func
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        } else {
            setText('')
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex  gap-3'>
                    <Avatar>
                        <AvatarImage src={post.author.profilePicture} alt="post" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <h1 className='font-medium'>{post.author?.username}</h1>
                        <span className='text-xs'>Original</span>
                    </div>
                    <span className='mt-1 text-sm hidden sm:block'>{timeAgo}</span>
                    <span className='mt-1'>{user?._id === post?.author._id && <Badge variant='secondary'>Author</Badge>}</span>
                </div>
                <Dialog >
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant="ghost" className='cursor-pointer w-fit text-[#ed4956] font-bold rounded'>Unfollow</Button>
                        <Button variant="ghost" className='cursor-pointer w-fit font-bold rounded'>add to favorites</Button>
                        {user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant="ghost" className='cursor-pointer w-fit rounded'>Delete</Button>}
                    </DialogContent>
                </Dialog>
            </div>
            <img src={post.image}
                alt="post_img"
                className='rounded my-4 w-full aspect-[3/4] object-cover border border-gray-400' />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {liked ? <FaHeart onClick={likeUnlikePost} size={'22px'} className={active ? `cursor-pointer text-red-600 animate-heart-bounce` : 'cursor-pointer text-red-600 '} /> : <FaRegHeart onClick={likeUnlikePost} size={'22px'} className='cursor-pointer hover:text-gray-600' />}

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }
                    } className='cursor-pointer hover:text-gray-600' />

                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='block font-medium mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {comment.length > 0 ?
                <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span> : ''}
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between mb-4'>
                <input type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder='add a comment...'
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={handleComments} className='text-[#38affe] cursor-pointer'>post</span>
                }
                <span className='ms-2'><FiSmile /></span>
            </div>
            <hr />
        </div>
    )
}

export default Post
