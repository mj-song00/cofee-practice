const express = require('express');
const postRouter = require('./routes/post');
const cors = require('cors');
const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello');
});

app.use('/api', postRouter);

app.listen(8000, () => {
  console.log('8000번 서버 실행 중');
});
