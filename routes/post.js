const express = require('express');
const { User, Post, Comment } = require('../models');
const authMiddleware = require('../middleware/auth-Middleware');
const router = express.Router();
const { Sequelize } = require('sequelize');
const { like } = Sequelize.Op;

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
    console.log(post)
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: User, attributes: ['id', 'nickname'] },
        {
          model: Comment,
        },
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
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    const comment = await Comment.findAll({
      where: { PostId: Number(req.params.id) },
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    res.status(201).json(comment);
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
    await post.addLikers(user.id);
    res.json({ PostId: post.id, UserId: user.id });
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
    res.json({ PostId: post.id, UserId: user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//게시물 검색
  router.get('/title', async (req, res, next) => {
    const searchWord = req.query.title //쿼리로 가져오기
    console.log(searchWord)
    if(!searchWord){ // 빈값이면
      return res.status(400).json('검색어를 입력하세요') 
    }

    let searchRsult = await Post.findAll({
      where : {
        title: {
              [like] : `%${searchWord}%` 
        }
      }
    })

    if (searchRsult.length != 0 ) {
      try {
        res.status(201).json(searchRsult)
      }catch(error){
        console.log(error)
      }
    }else {
      res.send({'msg' : `${searchWord}에 대한 검색 값이 없습니다.` })
    }
    
  })
module.exports = router;
