import express from 'express';
import { createComment, getComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/get-comments/:postId', getComment);

export default router;