import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId,io } from "../soket/socket.js";

//new post
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;
        if (!image) {
            return res.status(400).json({
                message: 'image is required'
            })
        }
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()
        //buffer to datauri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        })
        const user = await User.findById(authorId)
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'new post added',
            success: true,
            post
        })
    } catch (error) {
        console.log(error)
    }
}

//get all post 
export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture followers following' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//users own post
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            }).populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            })
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//likes 
export const likePost = async (req, res) => {
    try {
        const userLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'post not found', success: false })
        }
        //like the post logic
        await post.updateOne({ $addToSet: { likes: userLike } }) 
        await post.save();
        //socket io implement
        const user=await User.findById(userLike).select('username profilePicture');
        const postOwnerId=post.author.toString();
        if(postOwnerId !== userLike){
            //emit a noti event....

            const notification={
                type:'like',
                userId:userLike,
                userDetails:user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({message:'Post liked',success:true})
    } catch (error) {
        console.log(error)
    }
}
//dislike post
export const dislikePost = async (req, res) => {
    try {
        const userLike = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'post not found', success: false })
        }
        //like the post logic
        await post.updateOne({ $pull: { likes: userLike } }) 
        await post.save();
        //socket io implement
        const user=await User.findById(userLike).select('username profilePicture');
        const postOwnerId=post.author.toString();
        if(postOwnerId !== userLike){
            //emit a noti event....

            const notification={
                type:'dislike',
                userId:userLike,
                userDetails:user,
                postId,
                message:'Your post was disliked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)
        }

        return res.status(200).json({message:'post is disliked',success:true})
    } catch (error) {
        console.log(error)
    }
}

//add commets
export const addComments=async (req,res)=>{
    try {
        const postId=req.params.id;
        const commentUser=req.id;
        const {text}=req.body;
        const post=await Post.findById(postId)
        if(!text) return res.status(400).json({message:'text is required',success:false})
        const comment=await Comment.create({
            text,
            author:commentUser,
            post:postId
    })

   
    await comment.populate({path:'author',select:'username profilePicture'});
    post.comments.push(comment._id);
    await post.save();
    return res.status(201).json({
        message:'comment added',
        success:true,
        comment
    })
    } catch (error) {
        console.log(error)
    }
}

//post according comments
export const getCommentsOfPost=async(req,res)=>{
    try {
        const postId=req.params.id;
        const comments=await Comment.find({post:postId}).populate('author','username profilePicture');

        if(!comments) return res.status(404).json({message:'no comments found',success:false})

        return res.status(200).json({success:true,comments})
    } catch (error) {
        console.log(error)
    }
}

//delete post
export const deletePost=async (req,res)=>{
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const post=await Post.findById(postId)
        if(!post) return res.status(404).json({message:'post not found',success:false})
            //auth for delete post
        if(post.author.toString()!==authorId) return res.status(403).json({message:'unauthorized'});

        await Post.findByIdAndDelete(postId);

        //update user of post section
        let user=await User.findById(authorId);
        user.posts=user.posts.filter(id=>id.toString()!==postId);
        await user.save();

        //delete assosiated comments
        await Comment.deleteMany({post:postId})

        return res.status(200).json({success:true,
            message:'post deleted'
        })
    } catch (error) {
        console.log(error)
    }
}

//bookmark posts
export const bookmarkPost=async(req,res)=>{ 
    try {
        const postId=req.params.id;
        const authorId= req.id;
        const post= await Post.findById(postId);
        if(!post) return res.status(404).json({message:'post not found',success:false})
            

        const user= await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            //alredy book so unbookmark
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save(); 
            return res.status(200).json({type:'unsaved',message:'post remove form bookmark',success:true});
        }else{
            //bookmark
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await user.save(); 
            return res.status(200).json({type:'unsaved',message:'post added to bookmark',success:true});
        }
    } catch (error) {
        console.log(error)
    }
}