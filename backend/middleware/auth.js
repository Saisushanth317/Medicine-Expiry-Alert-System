const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ message: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role, name, email }
    next();
  } catch(err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req,res,next) => {
  if(!req.user) return res.status(401).json({ message: 'No user' });
  if(req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = { verifyToken, requireRole };
