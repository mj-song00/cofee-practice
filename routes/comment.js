const express = require('express');
const { Comment} = require('../models');
const router = express.Router();
const authMiddleware = require('../middleware/auth-Middleware')


router.get('/comment', ( req, res ) => {
  res.send("확인");
});

//댓글작성
router.post('/post/:postId/comment', authMiddleware, async (req, res) => {
  const {content } = req.body
  const {postId} = req.params


  try{
    if (content === null ) return res.status(400).send()

    const newComment = await Comment.create({
     content
    })

    res.status(201).json({ comment:newComment, postId
    })
    
  }catch(error ){
    console.log(error)
  }
})


module.exports = router;