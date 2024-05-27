const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../middleware/auth');

const boardController = require('../controller/boardController');
const commentController = require('../controller/commentController');

// 게시판 관련 라우트
router.post('/', isAuthenticated, boardController.createBoard); // 게시판 업로드
router.get('/', isAuthenticated, boardController.getAllBoards); // 전체 게시판 조회
router.get('/:id', isAuthenticated, boardController.getBoardById); // 게시판 단건 조회
router.put('/:id', isAuthenticated, boardController.updateBoard); // 게시판 수정
router.delete('/:id', isAuthenticated, boardController.deleteBoard); // 게시판 삭제

module.exports = router;
