const express = require('express');
const db = require('./models');
const cors = require('cors');
const morgan = require('morgan'); // 터미널에 프론트 요청오면 로그 찍합니다.

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res, next) => {
  res.send('Hello');
});

app.use('/api', postRouter);
app.use('/api', userRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.error(error);
  res.sendStatus(500);
});

app.use(express.urlencoded());
app.use(express.json());

app.listen(8000, () => {
  console.log('8000번 서버 실행 중');
});
