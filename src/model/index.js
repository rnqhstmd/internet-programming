const { sequelize } = require('../config/database');
const User = require('./user');

const initModels = async () => {
  await sequelize.sync({ force: false });
};

module.exports = { User, initModels };
