const express = require('express');
const { Comment, User} = require('../models');
const router = express.Router();
const authMiddleware = require('../middleware/auth-Middleware');

//댓글작성
router.post('/post/:postId/comment', authMiddleware, async (req, res) => {
  const { comment } = req.body;
  const { postId } = req.params;
  const UserId = res.locals.user.id;
  console.log(UserId);
  try {
    if (comment === null) return res.status(400).send();

    const newComment = await Comment.create({
      comment,
      PostId: postId,
      UserId,
    });
    const fullComment = await Comment.findOne({
      where: { id:newComment.id },
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

module.exports = router;
