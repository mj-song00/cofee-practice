const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.get('/', async (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || '').split(' ');
  
  try{
  const { userId } = jwt.verify(authToken, 'customized-secret-key');
  const userData = await User.findByPk(userId);
  
  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      nickname: '', result: false
    });
    return;
  }
  
  if (!userData.dataValues.id) {
    res.status(401).send({
      nickname: '', result: false
    });
    return;
  }

  res.status(201).send({
    nickname: userData.dataValues.nickname, result: true
  })
  } catch {
    res.status(401).send({
      nickname: '', result: false
    });
  } 
});

module.exports = router;