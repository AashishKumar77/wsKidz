'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    subscription_type:{type:DataTypes.INTEGER,comment:'0-yearly 1-monthly'} ,
    start_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    original_transaction_id:DataTypes.STRING,
    expiration_reason:{type:DataTypes.INTEGER,defaultValue:0,comment:'0-Not available,1-Customer Cancelled,2-Billing error,3-Customer not agree to new price,4-product not avl,5-Unknown'},
    platform:{type:DataTypes.INTEGER,comment:'0-ios 1-android'} ,
    status: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {});
  Subscription.associate = function(models) {
    // associations can be defined here
    Subscription.belongsTo(models.Account);
  };
  return Subscription;
};