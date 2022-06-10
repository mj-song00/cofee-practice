const express = require('express');
const postRouter = require('./routes/post');
const db = require('./models');
const cors = require('cors');
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
app.use(cors());
app.get('/', (req, res, next) => {
  res.send('Hello');
});

app.use('/api', postRouter);

app.listen(8000, () => {
  console.log('8000번 서버 실행 중');
});
