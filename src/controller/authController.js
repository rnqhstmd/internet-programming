const { User } = require('../model');

exports.register = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.create({ userId, password });
    req.session.user = user;
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ where: { userId } });
    if (user && (await user.matchPassword(password))) {
      req.session.user = user;
      res.json({ message: 'Logged in', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
};
