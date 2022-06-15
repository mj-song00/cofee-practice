const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Noti = require('./noti');

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: '127.0.0.1',
    dialect: 'mysql',
    timezone: '+09:00',
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true },
    timezone: '+09:00',
  }
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Noti = Noti;

User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Noti.init(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
Noti.associate(db);

module.exports = db;
