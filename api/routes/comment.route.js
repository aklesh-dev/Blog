import express from 'express';
import { createComment, getComment, likeComment, editComment, deleteComment, getComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/get-comments/:postId', getComment);
router.put('/like-comment/:commentId', verifyToken, likeComment);
router.put('/edit-comment/:commentId', verifyToken, editComment);
router.delete('/delete-comment/:commentId', verifyToken, deleteComment);
router.get('/getComments', verifyToken, getComments);

export default router;