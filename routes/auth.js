const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.get('/', async (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  const { userId } = jwt.verify(authToken, 'customized-secret-key');
  const userData = await User.findByPk(userId);

  console.log(userData.dataValues.id);

  if (!userData.dataValues.id) {
    res.status(401).send({
      status: false
    });
  }

  res.status(201).send({
    status: true
  })

});

module.exports = router;