const { sequelize } = require('../config/database');
const User = require('./user');
const Board = require('./board');
const Comment = require('./comment')

// User와 Board 관계 설정: 한 명의 사용자가 여러 게시판 글을 작성할 수 있음
User.hasMany(Board, {
  foreignKey: 'writerId', // User 모델의 id가 Board 모델의 writerId로 연결
  as: 'boards' // User 인스턴스에서 .getBoards() 같은 메서드로 접근 가능
});
Board.belongsTo(User, {
  foreignKey: 'writerId', // Board 모델에서 writerId가 User 모델의 id를 참조
  as: 'writer' // Board 인스턴스에서 .getWriter() 메서드로 사용자 정보 접근 가능
});

// Board와 Comment 관계 설정: 하나의 게시글에 여러 댓글이 달릴 수 있음
Board.hasMany(Comment, {
  foreignKey: 'boardId',
  as: 'comments' // Board 인스턴스에서 .getComments()로 접근 가능
});
Comment.belongsTo(Board, {
  foreignKey: 'boardId', // Comment 모델에서 boardId가 Board 모델의 id를 참조
  as: 'board' // Comment 인스턴스에서 .getBoard()로 게시글 정보 접근 가능
});

// User와 Comment 관계 설정: 사용자는 여러 댓글을 작성할 수 있음
User.hasMany(Comment, {
  foreignKey: 'writerId',
  as: 'userComments' // User 인스턴스에서 .getUserComments()로 접근 가능
});
Comment.belongsTo(User, {
  foreignKey: 'writerId', // Comment 모델에서 writerId가 User 모델의 id를 참조
  as: 'commentWriter' // Comment 인스턴스에서 .getCommentWriter()로 사용자 정보 접근 가능
});

const initModels = async () => {
  await sequelize.sync({ force: false }).catch((err) => {
    console.error('모델 초기화 실패');
    console.error(err);
});;
};

module.exports = { User, initModels, Board, Comment };
