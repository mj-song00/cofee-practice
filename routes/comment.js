const express = require('express');
const { Comment, User, Noti } = require('../models');
const router = express.Router();
const authMiddleware = require('../middleware/auth-Middleware');

//댓글작성
router.post('/post/:postId/comment', authMiddleware, async (req, res) => {
  const { comment } = req.body;
  const { postId } = req.params;
  const UserId = res.locals.user.id;
  const user = res.locals.user;
  console.log(UserId);
  try {
    if (comment === null) return res.status(400).send();

    const newComment = await Comment.create({
      comment,
      PostId: postId,
      UserId,
    });

    await Noti.create({
      PostId: postId,
      state: false,
      commentUser: user.nickname,
      type: 'comment',
    });

    const fullComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [{ model: User, attributes: ['id', 'nickname'] }],
    });
    res.status(201).json({ fullComment });
  } catch (error) {
    console.log(error);
  }
});

//댓글삭제
router.delete(
  '/post/:postId/comment/:commentId',
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;

    try {
      const existitComment = await Comment.findOne({
        where: { id: commentId },
      });
      console.log(existitComment);

      if (!existitComment)
        return res.status(400).send({ msg: '잘못된 접근입니다.' });

      await Comment.destroy({
        where: {
          id: commentId,
          postId,
        },
      });
      res.status(200).send({ msg: '삭제완료' });
    } catch (error) {
      console.log(error);
    }
  }
);

//댓글 수정
router.put(
  '/post/:postId/comment/:commentId',
  authMiddleware,
  async (req, res, next) => {
    const comment = await Comment.findOne({
      where: { id: Number(req.params.commentId) },
    });
    const user = res.locals.user;
    console.log(comment);
    if (comment.UserId !== user.id) {
      return res.status(401).json({ message: '작성자만 수정할 수 있습니다.' });
    }
    try {
      await Comment.update(
        {
          comment: req.body.comment,
        },
        { where: { id: Number(req.params.commentId) } }
      );

      const fullComment = await Comment.findOne({
        where: { id: Number(req.params.commentId) },
        include: [{ model: User, attributes: ['id', 'nickname'] }],
      });
      const commentNum = await Comment.findAll({
        where: { PostId: Number(req.params.commentId) },
      });
      res.status(201).json(fullComment);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);
module.exports = router;
