import express from 'express'
import upload from '../middlewares/multer.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { addComments, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';
const router=express.Router();

router.route('/addpost').post(isAuthenticated,upload.single('image'),addNewPost);
router.route('/all').get(isAuthenticated,getAllPost);
router.route('/userpost/all').get(isAuthenticated,getUserPost);
router.route('/:id/like').get(isAuthenticated,likePost);
router.route('/:id/dislike').get(isAuthenticated,dislikePost);
router.route('/:id/comment').post(isAuthenticated,addComments);
router.route('/:id/comment/all').post(isAuthenticated,getCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated,deletePost);
router.route('/:id/bookmark').post(isAuthenticated,bookmarkPost);
export default router;