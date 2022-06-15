const Sequelize = require('sequelize');

module.exports = class Noti extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        state: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: true,
        },
        commentUser: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        likeUser: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Noti',
        tableName: 'notis',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }
  static associate(db) {
    db.Noti.belongsTo(db.User);
    db.Noti.belongsTo(db.Post);
  }
};
