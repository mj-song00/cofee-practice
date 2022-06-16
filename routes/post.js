const express = require('express');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User, Post, Comment, Noti } = require('../models');
const authMiddleware = require('../middleware/auth-Middleware');
const router = express.Router();

// 전체게시글 조회
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        {
          model: Comment,
          attributes: ['comment', 'createdAt', 'updatedAt'],
          include: [{ model: User, attributes: ['id', 'nickname'] }],
        },
        { model: User, as: 'Likers', attributes: ['id', 'nickname'] },
      ],
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
    console.log(post);
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        {
          model: Comment,
        },
        { model: User, as: 'Likers', attributes: ['id', 'nickname'] },
      ],
    });
    res.status(201).json(fullPost);
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
      include: [{ model: User, as: 'Likers', attributes: ['id', 'nickname'] }],
    });
    const comment = await Comment.findAll({
      where: { PostId: Number(req.params.id) },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    res.status(201).json({ comment, Likers: post.Likers });
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
    const fullPost = await Post.findOne({
      where: { id: Number(req.params.id) },
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        {
          model: Comment,
          attributes: ['comment', 'createdAt', 'updatedAt'],
          include: [{ model: User, attributes: ['id', 'nickname'] }],
        },
        { model: User, as: 'Likers', attributes: ['id', 'nickname'] },
      ],
    });
    const commentNum = await Comment.findAll({
      where: { PostId: Number(req.params.id) },
    });
    res.status(201).json(fullPost);
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

// 좋아요 추가
router.patch('/post/:id/like', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  try {
    const post = await Post.findOne({ where: { id: Number(req.params.id) } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await Noti.create({
      PostId: req.params.id,
      state: false,
      likeUser: user.nickname,
      type: 'like',
    });
    await post.addLikers(user.id);
    res.json({ PostId: post.id, nickname: user.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 좋아요 삭제
router.delete('/post/:id/like', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;

  try {
    const post = await Post.findOne({ where: { id: Number(req.params.id) } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(user.id);
    res.json({ PostId: post.id, nickname: user.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 알람 기능
router.get('/alarm', authMiddleware, async (req, res, next) => {
  const user = res.locals.user;
  const post = await Post.findAll({
    attributes: ['id'],
    where: { userId: user.id },
  });

  const postId = post.map((v) => v.id);

  const alarm = await Noti.findAll({
    where: { PostId: postId },
    attributes: ['state', 'commentUser', 'likeUser', 'type', 'PostId'],
  });

  res.json({ nickname: user.nickname, alarm });
});

//게시물 검색
router.get('/title', async (req, res, next) => {
  const searchWord = req.query.title; //쿼리로 가져오기
  console.log(req.query);
  if (!searchWord) {
    // 검색어가 없으면
    return res.status(400).json({ msg: '검색어를 입력하세요' });
  }

  let searchRsult = await Post.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${searchWord}%`,
          },
        },
        {
          content: {
            [Op.like]: `%${searchWord}%`,
          },
        },
      ],
    },
  });

  if (searchRsult.length != 0) {
    try {
      res.status(201).json(searchRsult);
    } catch (error) {
      console.log(error);
    }
  } else {
    return res
      .status(400)
      .json({ msg: `${searchWord}에 대한 검색 값이 없습니다.` });
  }
});
module.exports = router;
