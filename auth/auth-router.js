const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/secret.js');
const Users = require('./auth-users-model');
const restricted = require('../auth/authenticate-middleware');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({
        message: 'server Issue'
      });
    });
});

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json({
        message: 'unable to process, server issue'
      });
    });
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);

        res.status(200).json({ token });
      } else {
        res.status(401).json({
          message: 'invalid credentials'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'server issue'
      });
    });
});

function signToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    department: user.department
  };
  const options = {
    expiresIn: '1d'
  };
  return jwt.sign(payload, jwtSecret, options);
}

function department(role) {
  return function(req, res, next) {
    if (
      req.user &&
      req.user.department &&
      req.user.department.toLowerCase() === role
    ) {
      next();
    } else {
      res.status(403).json({
        message: 'its not there server issue'
      });
    }
  };
}
module.exports = router;

module.exports = router;
