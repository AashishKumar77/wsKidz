'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    public_id: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar_id: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    charity_id: DataTypes.STRING,
    reset_password_token:DataTypes.TEXT,
    subscription_status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active 0-inactive'},
    loginattempt:{type:DataTypes.INTEGER,defaultValue:null,comment:'param will be active when login crosses 3 attempts'},
    password_count:{type:DataTypes.INTEGER},
    last_login_date: DataTypes.DATE,
    reset_password_date: DataTypes.DATE,
    status: {type:DataTypes.INTEGER,defaultValue:1,comment:'1-active 0-inactive'}
  }, {});
  Account.associate = function(models) {
   Account.hasMany(models.UserProfile,{onDelete:'cascade',foreignKey:'AccountId',as:'user_profiles'})
   Account.hasMany(models.UserDevice,{onDelete:'cascade'})
   Account.hasMany(models.UserAcceptedTerms,{onDelete:'cascade'})
   Account.hasMany(models.AppFeedbacks,{onDelete:'cascade'})
   Account.hasMany(models.Charity,{onDelete:'cascade'})
   Account.hasMany(models.Notifications,{onDelete:'cascade'})
   Account.hasMany(models.Subscription,{onDelete:'cascade'})
   Account.hasMany(models.Transaction,{onDelete:'cascade'})
   Account.hasMany(models.ContactUs,{onDelete:'cascade'})
  
  };
  return Account;
};