const express = require('express');
const { User, Post } = require('../models');
const authMiddleware = require('../middleware/auth-Middleware');
const router = express.Router();

// 전체게시글 조회
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 작성
router.post('/post', authMiddleware, async (req, res, next) => {
  const { title, img, content } = req.body;
  const UserId = res.locals.user.id;
  try {
    const post = await Post.create({ title, img, content, UserId });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 상세 조회
router.get('/post/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: Number(req.params.id) },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
