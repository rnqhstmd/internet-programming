const express = require("express");
const app = express();
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize, connectDB } = require('./config/database');
const { initModels } = require('./model');
const dotenv = require('dotenv');
const authRoutes = require('./route/authRoute');

dotenv.config();
connectDB();
initModels();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 라우트 설정
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

module.exports = app;