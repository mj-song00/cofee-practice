const express = require('express');
const { User, Post } = require('../models');

const router = express.Router();

// 전체게시글 조회
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 작성
router.post('/post', async (req, res, next) => {
  const { title, img, content } = req.body;
  try {
    const post = await Post.create({ title, img, content });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
