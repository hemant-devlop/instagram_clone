import {User}  from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

//register form
export const register = async (req, res) => {
    try {
        const { username,fullname, email, password,  } = req.body;
        if (!username || !fullname || !email || !password) {
            return res.status(401).json({
                message: 'required all fields',
                success: false
            })
        }

        //if exist
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const errorMsg = existingUser.email === email ? 'Email is already in use. Please use a different email.' : 'Username is already taken. Please choose another username.';
            return res.status(409).json({
                message: errorMsg,
                success: false
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            fullname,
            email,
            password: hashPassword
        })
        return res.status(201).json({
            message: 'document created succesfully',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//login form
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'email and password is required',
                success: false
            });
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: 'email is incorrect',
                success: false
            })
        }
        //password hashing
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'password is incorrect',
                success: false
            })
        }
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        const populatedPost= await Promise.all(
            user.posts.map(async (postId)=>{
                const post=await Post.findById(postId);
                if(post && post.author.equals(user._id)){ 
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPost,
        }
        await res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}
//logout
export const logout = async (_, res) => {
    try {
        return res.cookie('token', '', { maxAge: 0 }).json({
            message: 'You have successfully logged out!',
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//get profile 
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks').select('-password')
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
//edit profile
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'user not found',
                success: false
            })
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'profile updated',
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}
//suggested users
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select('-password');
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "currently dont have any users"
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}
//followers
export const followAndUnfollow = async (req, res) => {
    try {
        const followerCondidate = req.id;//logged user
        const followedCondidate = req.params.id;//user we are following 
        if (followerCondidate === followedCondidate) {
            return res.status(400).json({
                message: 'you cant follow your self',
                success: false
            })
        }
        const user = await User.findById(followerCondidate);
        const target = await User.findById(followedCondidate);
        if (!user || !target) {
            return res.status(400).json({
                message: 'user not found',
                success: false
            });
        }
        
        //cheak for follow or unfollow
        const isfollowing = user.following.includes(followedCondidate);
        if (isfollowing) {
            //unfollow logic
            await Promise.all([
                User.updateOne({ _id: followerCondidate }, { $pull: { following: followedCondidate } }),
                User.updateOne({ _id: followedCondidate }, { $pull: { followers: followerCondidate } })
            ])
            return res.status(200).json({message:'unfollow success',success:true})
        } else {
            //follow logic
            await Promise.all([
                User.updateOne({ _id: followerCondidate }, { $push: { following: followedCondidate } }),
                User.updateOne({ _id: followedCondidate }, { $push: { followers: followerCondidate } })
            ])
            return res.status(200).json({message:'follow success',success:true})
        }
    } catch (error) {
        console.log(error)
    }
}