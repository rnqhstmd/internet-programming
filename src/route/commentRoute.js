const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const { isAuthenticated } = require('../middleware/auth');

// 댓글 생성
router.post('/boards/:boardId/comments', isAuthenticated, commentController.createComment);

// 댓글 수정
router.put('/boards/:boardId/comments/:commentId', isAuthenticated, commentController.updateComment);

// 댓글 삭제
router.delete('/boards/:boardId/comments/:commentId', isAuthenticated, commentController.deleteComment);

module.exports = router;