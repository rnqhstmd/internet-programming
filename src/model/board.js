const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Board = sequelize.define(
    'Board',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        writerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true, // 자동으로 createdAt과 updatedAt 타임스탬프 생성
    }
);

module.exports = Board;
