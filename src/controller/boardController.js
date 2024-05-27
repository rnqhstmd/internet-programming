const { Board, Comment } = require('../model');

// 게시판 업로드
exports.createBoard = async (req, res) => {
    const { title, content, productName } = req.body;
    console.log("Received data:", title, content, productName);
    console.log(req.session.user);
    try {
        const board = await Board.create({
            title,
            content,
            productName,
            writerId: req.session.user.userId, // 세션에서 사용자 ID 가져오기
        });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 전체 게시판 조회
exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.findAll();
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 게시판 단건 조회
exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id, {
            include:[{
                model:Comment,
                as:'comments',
                attributes:['id', 'content', 'writerId']
            }]
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // 추가된 부분: 로그인한 사용자가 게시글 작성자인지 확인
        const isMine = req.session.user && req.session.user.userId === board.writerId;
        const comments = board.comments || [];
        
        // 게시판 정보와 댓글 목록을 포함하여 반환
        res.json({
            id: board.id,
            title: board.title,
            content: board.content,
            writerName: board.writerName,
            productName: board.productName,
            isMine: isMine,
            comments: comments.map(comment => ({
                commentId: comment.id,
                commentContent: comment.content,
                commentWriter: comment.writerId,
                isMyComment: req.session.user && req.session.user.userId === comment.writerId
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 게시판 수정
exports.updateBoard = async (req, res) => {
    const userId = req.session.user.userId;
    try {
        const { title, content, productName } = req.body;
        const board = await Board.update(
            { title, content, productName },
            {
                where: { id: req.params.id },
            }
        );

        // 작성자 검증
        if (board.writerId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (board == 1) {
            // 성공적으로 업데이트 됐는지 확인
            res.json({ message: 'Board updated' });
        } else {
            res.status(404).json({ message: 'Board not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 게시판 삭제
exports.deleteBoard = async (req, res) => {
    const userId = req.session.user.userId;
    try {
        const board = await Board.findByPk(req.params.id);
        const result = await Board.destroy({
            where: { id: req.params.id },
        });

        // 작성자 검증
        if (board.writerId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (result == 1) {
            res.json({ message: 'Board deleted' });
        } else {
            res.status(404).json({ message: 'Board not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
