const {User, Board, Comment } = require('../model');

// 게시판 업로드
exports.createBoard = async (req, res) => {
    const { title, content, productName } = req.body;
    console.log("Received data:", title, content, productName);
    console.log(req.session.user.id);
    try {
        const board = await Board.create({
            title,
            content,
            productName,
            writerId: req.session.user.id, // 세션에서 사용자 ID 가져오기
        });
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 전체 게시판 조회
exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.findAll({
            include: [{
                model: User,
                as: 'writer', // Board 모델에서 User 모델을 참조하는 관계의 alias
                attributes: ['userId'] // 사용자의 이름 필드
            }]
        });
        const formattedBoards = boards.map(board => ({
            id: board.id,
            title: board.title,
            content: board.content,
            writerName: board.writer.userId, // 작성자 이름을 포함
            productName: board.productName
        }));

        res.json(formattedBoards); // 수정된 데이터 형식으로 응답
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 게시판 단건 조회
exports.getBoardById = async (req, res) => {
    try {
        const board = await Board.findByPk(req.params.id, {
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'commentWriter',
                        attributes: ['userId'] // 댓글 작성자의 userId를 가져옴
                    }],
                    attributes: ['id', 'content', 'writerId']
                },
                {
                    model: User, // User 모델을 포함
                    as: 'writer', // User 모델의 연관 관계 alias
                    attributes: ['userId'] // 게시글 작성자의 userId를 가져옴
                }
            ]
        });

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // 추가된 부분: 로그인한 사용자가 게시글 작성자인지 확인
        const isMine = req.session.user && req.session.user.id === board.writerId;
        const comments = board.comments || [];

        // 게시판 정보와 댓글 목록을 포함하여 반환
        res.json({
            id: board.id,
            title: board.title,
            content: board.content,
            productName: board.productName,
            isMine: isMine,
            writerName: board.writer.userId, // 수정: 작성자의 이름을 username 필드로 사용
            comments: comments.map(comment => ({
                commentId: comment.id,
                commentContent: comment.content,
                commentWriter: comment.commentWriter.userId,
                isMyComment: req.session.user && req.session.user.id === comment.writerId
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 게시판 수정
exports.updateBoard = async (req, res) => {
    const userId = req.session.user.userId;
    console.log("userId:", userId);
    try {
        const board = await Board.findByPk(req.params.id);
        // 작성자 검증
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        if (board.writerId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const { title, content, productName } = req.body;
        // board 변수명을 updateResult 등으로 변경하여 충돌 방지
        const updateResult = await Board.update(
            { title, content, productName },
            {
                where: { id: req.params.id }
            }
        );

        // Sequelize update는 업데이트된 행의 수를 배열로 반환합니다. 따라서 updateResult[0]을 검사합니다.
        if (updateResult[0] === 1) {
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
    const userId = req.session.user.id;
    try {
        const board = await Board.findByPk(req.params.id);
        // 작성자 검증
        if (board.writerId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const result = await Board.destroy({
            where: { id: req.params.id },
        });

        if (result == 1) {
            res.json({ message: 'Board deleted' });
        } else {
            res.status(404).json({ message: 'Board not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
