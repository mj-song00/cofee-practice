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

// 게시글 수정

router.put('/post/:id', authMiddleware, async (req, res, next) => {
  const post = await Post.findOne({ where: { id: Number(req.params.id) } });
  const user = res.locals.user;
  if (post.UserId !== user.id) {
    return res.status(401).json({ message: '작성자만 수정할 수 있습니다.' });
  }
  try {
    await Post.update(
      {
        title: req.body.title,
        img: req.body.img,
        content: req.body.content,
      },
      { where: { id: Number(req.params.id) } }
    );
    res.status(201).json({ PostId: Number(req.params.id) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 삭제
router.delete('/post/:id', authMiddleware, async (req, res, next) => {
  const post = await Post.findOne({ where: { id: Number(req.params.id) } });
  const user = res.locals.user;
  if (post.UserId !== user.id) {
    return res.status(401).json({ message: '작성자만 삭제할 수 있습니다.' });
  }
  try {
    await Post.destroy({
      where: { id: Number(req.params.id) },
    });
    res.json({ PostId: Number(req.params.id) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
