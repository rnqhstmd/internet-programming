const { Comment, Board } = require('../model');

// 댓글 생성
exports.createComment = async (req, res) => {
    console.log("Session:", req.session);
    const boardId = req.params.boardId;// URL에서 게시판 ID 추출
    console.log("Received boardId:", boardId);
    const { content } = req.body;
    console.log("Received content:", content);
    const userId = req.session.user.userId; // 세션에서 사용자 ID 추출
    try {
        // 게시판 존재 확인
        const board = await Board.findByPk(boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // 댓글 생성
        const comment = await Comment.create({
            content,
            boardId,
            writerId: userId, // 세션 사용자 ID 사용
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    const { boardId, commentId } = req.params;
    const { content } = req.body;

    try {
        // 댓글 존재 확인
        const comment = await Comment.findOne({
            where: {
                id: commentId,
                boardId: boardId,
            },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // 댓글 수정 권한 확인
        if (comment.writerId !== req.session.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({ message: 'Comment updated', comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const { boardId, commentId } = req.params;

    try {
        const comment = await Comment.findOne({
            where: {
                id: commentId,
                boardId: boardId,
            },
        });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // 댓글 삭제 권한 확인
        if (comment.writerId !== req.session.user.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
