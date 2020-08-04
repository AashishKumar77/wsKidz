'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    platform:{type:DataTypes.INTEGER,comment:'0-ios 1-android'} ,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Account)
  };
  return Transaction;
};