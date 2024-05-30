const express = require("express");
const app = express();
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize, connectDB } = require('./config/database');
const { initModels } = require('./model');
const dotenv = require('dotenv');
const authRoutes = require('./route/authRoute');
const boardRoutes = require('./route/boardRoute');
const commentRoutes = require('./route/commentRoute');

app.use(cors({
    origin: "http://127.0.0.1:5500", 
    credentials: true
}));
app.options('*', cors());

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
    secure:false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api', commentRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

module.exports = app;