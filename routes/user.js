// 회원가입 관련 API 작성하기
const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const authMiddleware = require('../middleware/auth-Middleware');
const router = express.Router();
const crypto = require('crypto');

// validation 조건 설정(현재는 설정X)
// const postUserSchema = joi.object({
//   nickname: joi.string().min(3).pattern(RegExp(/^[a-z|A-Z|0-9]+$/)).required(),
//   password: joi.string().min(4).required(),
//   confirmPassword: joi.string().min(4).required(),
// });

// 접속 테스트

// router.get('/', (req, res) => {
//   res.send('접속완료');
// });

// 회원가입 구현 API(비밀번호 Hashing 완료)

router.post('/signup', async (req, res) => {

  const { email, nickname, password, passwordCheck } = req.body;

  if (password !== passwordCheck) {
    res.status(400).send({ result: false });
    return;
  }

  const existUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });

  if (existUsers.length) {
    res.status(400).send({
      result: false
    });
    return;
  }

  const passwordCrypted = crypto.createHash('sha512').update(password).digest('base64');

  await User.create({ email, nickname, password: passwordCrypted });
  res.status(201).send({
    result: true
  });
});

// 로그인 구현 API

router.post('/login', async (req, res) => {
  console.log(req.headers);

  const { email, password } = req.body;

  const passwordCrypted = crypto.createHash('sha512').update(password).digest('base64');

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user || passwordCrypted !== user.password) {
    res.status(400).send({
      result: false,
      nickname: '',
      token: ''
    });
    return;
  }

  res.send({
    result: true,
    nickname: user.nickname,
    token: jwt.sign({ userId: user.id, nickname: user.nickname }, 'customized-secret-key')
  });
});

// 아이디 중복 검사

router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const user = await User.findOne({
    where: {
      email,
    },
  });
  
  if (user === null) {
    res.status(400).send({
      result: true
    });
    return;
  }
  res.status(201).send({
    result: false
  });
});

// 닉네임 중복 검사

router.get('/nickname/:nickname', async (req, res) => {
  const { nickname } = req.params;
  console.log(nickname);
  const user = await User.findOne({
    where: {
      nickname,
    },
  });
  
  if (user === null) {
    res.status(400).send({
      result: true
    });
    return;
  }
  res.status(201).send({
    result: false
  });
});

module.exports = router;
