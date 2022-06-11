// 회원가입 관련 API 작성하기
const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const authMiddleware = require('../middleware/auth-Middleware')
const router = express.Router();


// validation 조건 설정(현재는 설정X)
// const postUserSchema = joi.object({
//   nickname: joi.string().min(3).pattern(RegExp(/^[a-z|A-Z|0-9]+$/)).required(),
//   password: joi.string().min(4).required(),
//   confirmPassword: joi.string().min(4).required(),
// });

// 접속 테스트

router.get('/user', ( req, res ) => {
  res.send("접속완료");
});

// 회원가입 구현 API

router.post('/user/signup', async ( req, res ) => {

  const { email, nickname, password, passwordCheck } = req.body;

  if ( password !== passwordCheck ) {
    res.status(400).send({ errorMessage: "패스워드가 일치하지 않습니다." });
    return;
  }

  const existUsers = await User.findAll({
    where: {
      [Op.or]: [{email}, {nickname}],
    },
  });

  if (existUsers.length) {
    res.status(400).send({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  await User.create({ email, nickname, password });
  res.status(201).send({});
});

// 로그인 구현 API

router.post("/user/login", async (req, res) => {
  console.log(req.headers);
  
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
  });
});


module.exports = router;
