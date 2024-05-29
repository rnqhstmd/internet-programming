const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define(
    'Comment',
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        writerId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        boardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true, // 자동으로 createdAt과 updatedAt 타임스탬프 생성
    }
);

module.exports = Comment;
