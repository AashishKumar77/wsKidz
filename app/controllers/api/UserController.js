// bcryptjs use for password hashing SHA256 encryption
const bcrypt = require('bcryptjs')
// jsonwebtoken use for authentication
const jwt = require('jsonwebtoken')
// moment js library use for (convert date object year, month, day and minutes)
const moment = require('moment')
// nodemail use for smtp send mail
const nodemailer = require("nodemailer")
// node input validator use for validate a form
const { Validator } = require('node-input-validator')

// call models file
const db = require('../../../models')
// require sequelize query operators
const { Op } = require("sequelize")
const sequelize=require("sequelize")
// require model with models file db instance
let Helper=require('../../helpers/Helper');

const Account= db.Account
const UserProfiles=db.UserProfile
const Charity = db.Charity
const UserDevices=db.UserDevice
const UserAcceptedTerms=db.UserAcceptedTerms
const TermConditions=db.TermConditions
const ReadStory=db.Read_stories
const FavouriteStory=db.Favourite_stories
const Story=db.Story
const StoryCategory=db.Story_category
const UserBadges=db.UserBadges
const ProfileValue=db.ProfileValue
const Badge=db.Badge
const ValueTag=db.ValueTag
const ForceUpdate=db.ForceUpdate
const Thoughts=db.Thoughts
const Faq=db.Faq
const Feedback= db.AppFeedbacks
let Contact = db.ContactUs
const Subscription = db.Subscription
let Transaction = db.Transaction
const Raw=require('../../../models/index')
var sesTransport = require('nodemailer-ses-transport');
const { profile } = require('console')
const { forEach } = require('async')
    var SESCREDENTIALS = {
      accessKeyId : process.env.AMAZON_ACCESSKEYID,
      secretAccessKey : process.env.AMAZON_SECRETACCESSKEY
    }
    var transporter = nodemailer.createTransport(sesTransport({
      accessKeyId: SESCREDENTIALS.accessKeyId,
      secretAccessKey: SESCREDENTIALS.secretAccessKey,
      rateLimit: 5
  }));
// let otp = Math.floor(1000 + Math.random() * 9000);
let otp=1234
// user register process
async function makeUserSession(user_id,inputs,auth_token){ //common function for posting user session + device details
   //making user device + session entry
   let app_id=inputs.app_id?inputs.app_id:'';
   let device_token=inputs.device_token?inputs.device_token:'';
   let device_type=inputs.os_type?inputs.os_type:0;
   let device_model=inputs.device_model?inputs.device_model:'';
   let app_version=inputs.app_version?inputs.app_version:'';
   let os_version=inputs.os_version?inputs.os_version:'';
   let locale=inputs.locale?inputs.locale:'';
   let deviceCheck=await UserDevices.findOne({where:{device_token:device_token},attributes:["id"]})
   if(deviceCheck){ // if already same device_token is there in database
      UserDevices.update({'AccountId':user_id,'locale':locale,'os_version':os_version,'device_id':app_id,'device_token':device_token,'os_type':device_type,'device_model':device_model,'auth_token':auth_token,'app_version':app_version,'status':1},{where:{device_token:device_token}})
    }else{ // if not same device_token not present
      UserDevices.create({'AccountId':user_id,'locale':locale,'os_version':os_version,'device_id':app_id,'device_token':device_token,'os_type':device_type,'device_model':device_model,'auth_token':auth_token,'app_version':app_version});
    }
}

function sendEmail(name,email,subject){
   let mailOptions = {
      from:'bw21otp@gmail.com',
      to: email,
      // to:'sfs.chitesh20@gmail.com',
      subject: subject,
      html:'<html><head><title></title><link href="https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap" rel="stylesheet"></head>'+
          '<body style="margin: 0; padding: 0; font-family: "Poppins",arial, sans-serif;">'+
          '<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EAECED">'+
          '<tbody>'+
          '<tr><td height="20">&nbsp;</td></tr>'+
          '<tr>'+
          '<td align="center" valign="top">'+
          '<table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="overflow:hidden!important;border-radius:3px" width="700">'+
          '<tbody>'+
          '<tr>'+
          '<td bgcolor="#ffffff" align="center" height="160" style="padding:15px 0">'+
          '<a href="#" target="_blank">'+
          '<img src="http://54.90.62.46:4800/public/logo.png" width="160">'+
          '</a>'+
          '</td>'+
          '</tr>'+
          '<tr>'+
          '<td>&nbsp;</td>'+
          '</tr>'+
          '<tr>'+
          '<td align="center">'+
          '<table width="85%">'+
          '<tbody>'+
          '<tr>'+

          '<td align="center">'+
          '<span style="margin:0!important;font-family: "Poppins",arial, sans-serif !important;font-size:38px;line-height:44px;font-weight:200;color:#252b33; width:100%">'+
          '<strong> New User </strong></span>'+
          '<br>'+
          '</td>'+

          '</tr>'+
          '<tr>'+

          '<td align="center" style="font-size:20px;line-height:38px;font-weight:400;color:#252b33;font-style:italic!important;font-family: "Poppins",arial, sans-serif!important;">'+
          '<br>Hi <b>'+name+'</b>'+
          '</td>'+
          '</tr>'+
          '</tbody>'+
          '</table>'+
          '</td>'+
          '</tr>'+
          '<tr>'+
          '<td align="center">'+
          '<table border="0" cellpadding="0" cellspacing="0" width="78%">'+
          '<tbody>'+
          '<tr>'+
          '<td align="center" style="font-size:18px!important;line-height:26px!important;font-weight:400!important;color:#333!important;font-family: "Poppins",arial, sans-serif!important;">'+
          '<p style="margin: 0;">'+
          'You are registered succesfully</p>'+
          '</td>'+
          '</tr>'+
          '<tr>'+
          '<td align="center" style="font-size:60px!important;line-height:80px!important;font-weight:600!important;color:#3B7CC2 !important;font-family: "Poppins",arial, sans-serif!important;">'+
          '<p style="margin: 20px 0; letter-spacing:10px;"></p>'+
          '</td>'+
          '</tr>'+
          '</tbody>'+
          '</table>'+
          '</td>'+
          '</tr>'+
          '<tr>'+
          '<td>&nbsp;</td>'+
          '</tr>'+

          '<tr>'+
          '<td height="30">&nbsp;</td>'+
          '</tr>'+
          '<tr>'+

          '<td align="center" bgcolor="#ffffff">'+
          '<br>'+
          '<p style="margin-bottom:1em;font-family: "Poppins",arial, sans-serif!important;padding:0!important;margin:0!important;color:#444!important;font-size:12px!important;font-weight:300!important">'+
          '<span>   Email sent by WiseKid Team <br>'+
          '© Copyright-2020 WiseKid, All rights reserved</span></p>'+
          '<br>'+
          '</td>'+
          '</tr>'+
          '</tbody>'+
          '</table>'+
          '</td>'+
          '</tr>'+
          '<tr>'+
          '<td height="20">&nbsp;</td>'+
          '</tr>'+
          '</tbody>'+
          '</table>'+
          '</body>'+
          '</html>'
      // html: '<p>Hi, </p><p>This is your authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
   }
   transporter.sendMail(mailOptions, function(error, info){  //amazon transporter
      if (error) {
         console.log(error)
      }else{console.log('mail sent'
      )}
   });
}

function UserTermsCondition(user_id,inputs,terms_version_id){ // common function for posting terms and conditions
   let app_version=inputs.app_version?inputs.app_version:0;
   let device_type=inputs.device_type?inputs.device_type:0;
   UserAcceptedTerms.create({'AccountId':user_id,'app_version':app_version,'os_type':device_type,'TermConditionId':terms_version_id})
}

async function expireAllSessions(public_id){ // will be called when password reset happen
   let account= await Account.findOne({where:{public_id:public_id},attributes:["id"]})
   if(account){
      UserDevices.update({status:0,auth_token:null},{where:{AccountId:account.id}})
   }
}

async function getResult(user_id,endpoint=null,app_version=null,headers){ // common function for using same query
   return new Promise(async (resolve,reject)=>{
      await Account.findOne({
         attributes: ['public_id','subscription_status',"loginattempt"],
         where: {id: user_id},
         include:[
            {model: UserProfiles,as:'user_profiles',attributes: ['id', 'name','avatar_id','age','account_type','audio_mode','points'],required:false,
               include:[
                  {model:ReadStory,as:"read_stories",attributes:['id','StoryId','liked','status'],required:false,
                    
                  },
                  {model:FavouriteStory,as:"favourite_stories",attributes:['id','StoryId'],where:{status:1},required:false,
                  },
                  {model:UserBadges,as:"user_badges",attributes:['id'],required:false,
                  include:[{model:Badge,as:"badges",required:false,attributes:["id","name","icon_url"]}]
                  },
                  {model:ProfileValue,as:"profile_values",attribute:["id","points"],required:false,limit:10,order:[["point","DESC"]],
                  include:[{model:ValueTag,as:'tags',required:false,attributes:["name","color"]}]
                  }
               ]
            },
         ]
   }).then(async (user)=>{
      
      let allStories =await StoryCategory.findAll({
            attributes:[['name','cat_name']],
            where:{status:1},
            include:[{model:Story,as: 'stories',where:{status:1},required:true,attributes:["id","title",["catalogue_image","thumbnail_image"],"locked","video_url"]}] 
      })
      let thought=await Thoughts.findOne({where:{status:1},attributes:["thought"]})
      let notific;
      if(headers.device_token){ // if device token is coming
         notific=await UserDevices.findOne({where:{device_token:headers.device_token},attributes:["notification_enrolled"]})
      }
      
      let profiles=[];
      if(user.user_profiles.length>0){
         let user_profiles=user.user_profiles;
         user_profiles.forEach((element)=>{ //iterating over profiles
         //making badges array
            let badges=[];
            element.user_badges.forEach((element)=>{ //iteration over badges                                   
               badges.push({
                  id:element.id,
                  name:element.badges?element.badges.name:'',
                  image:element.badges?element.badges.icon_url:'',
                  latest_badge:false
               })                             
            }) 
            let values=[];
            element.profile_values.forEach((element)=>{ //iterating over values                              
               values.push({
                  id:element.id,
                  name:element.tags?element.tags.name:'',
                  points:element.point,
                  color:element.tags?element.tags.color:''
               })
            })
            let liked_stories=[];
            let continue_reading=[];
            let read_stories=[];
            if(element.read_stories.length>0){
              Helper.multisort(element.read_stories,['id'],['DESC']) //sorting record latest first
               element.read_stories.map(obj=>{
                  if(obj['liked']==1){ //checking if story liked by that profile
                     liked_stories.push(obj['StoryId'])
                  }
                  if(obj['status']==1){ //continue reading array
                     continue_reading.push(obj['StoryId'])
                  }else if(obj['status']==2){
                     read_stories.push(obj['StoryId'])
                  }else if(obj['status']==3){
                     continue_reading.push(obj['StoryId'])
                     read_stories.push(obj['StoryId'])
                  }
               })
            }
            if(element.favourite_stories.length>0){ // sorting record latest first
               Helper.multisort(element.favourite_stories,['id'],['DESC'])
            }
            profiles.push({
               id:element.id,
               name:element.name,
               age:element.age,
               comments_enabled:true,
               points:element.points,
               avatar_id:element.avatar_id,
               profile_type:element.account_type,
               audio_mode:element.audio_mode,
               read_stories:read_stories,
               continue_reading:continue_reading,
               favourite_stories:element.favourite_stories.length>0?element.favourite_stories.map(obj=>obj['StoryId']):[],
               liked_stories:liked_stories,
               badges:badges,
               values:values
            });
         });
      }
      let newArray={};
      newArray.public_id=user.public_id;
      if(endpoint=='register'){

      }else{
         let forceUpdateFlag=await ForceUpdate.findOne({where:{app_version:app_version},attributes:["force_upgrade"]})
         newArray.force_upgrade=forceUpdateFlag?forceUpdateFlag.force_upgrade:false;
      }
      newArray.maximum_points = 50;
      newArray.subscription_status=user.subscription_status;
      newArray.notification_enrolled=notific?notific.notification_enrolled==1?true:false:false;
      newArray.thought=thought?thought.thought:'';
      newArray.profiles=profiles;
      newArray.catalogue=allStories; 
      resolve(newArray);
   }).catch((err)=>{
      reject(err)
   });
   })  
}

exports.register = async function (req, res) {
   let path=req.route.path?req.route.path.substr(1):'';
   try {
     
      let v = new Validator(req.body, { //validator 
         name: 'required',
         email: 'required|email',
         password: 'required|minLength:8',
      })
     
      let arrayValidationMatched = await v.check()
      // let objectValidationMatched = await v2.check()
      if (!arrayValidationMatched) {
         let passwordError=v.errors.password?v.errors.password.message:"";
         let emailError=v.errors.email?v.errors.email.message+',':"";
         let name=v.errors.name?v.errors.name.message+',':"";
         res.status(422).json({
            statusCode: 422,
            action: path,
            message: name+emailError+passwordError,
            // validation_errors: name+emailError+passwordError
         });
      } else {
         Account.findOne({ where: { email: req.body.email } }).then(result => { //check if email exist in record
            if (result) {
               res.status(409).json({
                  statusCode: 409,
                  action: path,
                  message: 'User with the email \'' + req.body.email + '\' already exists.'
               }); return;
            } else { // if email do not exist in record
               bcrypt.genSalt(10, async (err, salt) => { //generating password hash
                  bcrypt.hash(req.body.password, salt, async (err, hash) => {
                     if (err) {
                        res.status(500).json({ statusCode: 500,action: path, message: 'Something Went Wrong' });
                     } else {
                        let unique_id= Date.now(); // generating unique public id
                        let charityArr = req.body.charity_id
                        let charityString=charityArr.length>0?charityArr.toString():''; //converting charity array into comma separated string
                        Account.create({ email: req.body.email, password: hash, name: req.body.name,public_id:unique_id,charity_id: charityString}) //creating user
                           .then(async user => {
                              let profile=[];
                              profile.push({ //by default setting this object for parent profile
                                 'account_type':1, 
                                 'avatar_id':req.body.avatar_id?req.body.avatar_id:1,
                                 'name':req.body.name,
                                 'age':req.body.age?req.body.age:0,
                                 'AccountId':user.id
                              });
                              if (req.body.childProfile.length>0&& req.body.childProfile[0].name !== ''
                                 && req.body.childProfile[0].age > 0) { //validating child profiles and checking if child array is coming
                                    let childProfile=req.body.childProfile;
                                   
                                    await childProfile.forEach(async(item)=>{ //creating array for profiles
                                       profile.push({
                                          'account_type':0, 
                                          'avatar_id':item.avatar_id,
                                          'name':item.name,
                                          'age':item.age,
                                          'AccountId':user.id
                                       })
                                    });      
                              }
                              await UserProfiles.bulkCreate(profile).catch(err=>{}) //creating bulk records
                                 // generate jwt token
                              let token = jwt.sign(user.dataValues, 'secretKey') //generating token
                              makeUserSession(user.id,req.headers,token); //making user session
                              let version_id=req.body.terms_version_id?req.body.terms_version_id:null;
                              UserTermsCondition(user.id,req.headers,version_id); //making terms and condition
                              //getting result for register
                              sendEmail(req.body.name,req.body.email,'Register') // sending mail for successfull completion

                              getResult(user.id,'register',false,req.headers).then(user=>{
                                    res.status(200).json({
                                       statusCode: 200,
                                       action: path,
                                       message: "User Registered Succesfully",
                                       user: user,
                                       token: token
                                    });
                              }).catch(err=>{
                                    console.log(err)
                                    res.status(500).json({
                                       statusCode: 500,
                                       action: path,
                                       message: "Something went wrong",
                                    });  
                              }); 
                           });
                     }
                  });
               });
            }
         });
      }
   } catch (e) {
      console.log(e)
      res.status(500).json({ statusCode: 500, action: path, message: 'Something Went Wrong' })
   }
}

exports.checkEmailUniqueness= async (req,res)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, { //validator
         email: 'required|email',
      })
      const matched = await v.check()
      if (!matched) { //if validator do not pass non empty check
         let emailError=v.errors.email?v.errors.email.message:"";
         res.status(422).json({ statusCode: 422,action: path, message:emailError })
         return;
      } else { //if validator pass checks
         Account.findOne({where:{email:req.body.email}}).then((result)=>{ 
            if(result){ //if email already present in db
               res.status(409).json({statusCode:409,action:path,message:'Account is already created with this email id. Please use different email id'});
            }else{ //if email is available
               res.status(200).json({statusCode:200,action:path,message:''});
            }
         }).catch((err)=>{
            res.status(500).json({ statusCode: 500, action: path, message: 'Something Went Wrong' })
         });
      }
   } catch (e) {
      res.status(500).json({ statusCode: 500, action: path, message: 'Something Went Wrong' })
   }
}
// user login process
exports.login = async (req, res) => {
   let path=req.route.path?req.route.path.substr(1):'';
   try {
      
      const v = new Validator(req.body, {
         email: 'required|email',
         password: 'required'
      })
      const matched = await v.check()
      if (!matched) {
         let passwordError=v.errors.password?v.errors.password.message:"";
         let emailError=v.errors.email?v.errors.email.message+',':"";
         res.status(422).json({ statusCode: 422,action: path, message:emailError+passwordError })
         return;
      } else {
         let blocked=false;
         Account.findOne({ where: { email: req.body.email, status: 1 } }).then(async user => {
            if (!user) {
               res.status(404).json({ statusCode: 404,action: path, message: 'You are not registered.' }); return;
            } else {
               if(user.loginattempt && user.loginattempt>=moment().unix()){ //checking if 5 minutes is elapsed or not 
                     let timeLeft=Helper.getMinutesAndSecondFromTimestamp(user.loginattempt,moment().unix())
                     let newArray={};
                     newArray.public_id='';
                     newArray.blocked=true;
                     newArray.timestamp=user.loginattempt;
                     newArray.thought='';
                     newArray.subscription_status='';
                     newArray.notification_enrolled='';
                     newArray.profiles=[];
                     newArray.catalogue=[];
                     res.status(400).json({
                        statusCode: 400,
                        action: path,
                        message:'Your account has been freezed for '+timeLeft+' min because of a wrong password attempt.',
                        user: newArray,
                        token: ''
                     });
               }else{ //if timestamp is empty or 5 minutes are passed
                  if (bcrypt.compareSync(req.body.password, user.password)) {
                     // generate jwt token
                     let token = jwt.sign(user.dataValues, 'secretKey') //generating token
                     Account.update({loginattempt:null,password_count:0},{where:{email:req.body.email}}) 
                     makeUserSession(user.id,req.headers,token); //making user session
                     let app_version=req.headers.app_version?req.headers.app_version:'';
                     getResult(user.id,'login',app_version,req.headers).then(user=>{ //getting result
                        res.status(200).json({
                           statusCode: 200,
                           action: path,
                           message: "Login successful!",
                           user: user,
                           token: token
                        });
                     }).catch(err=>console.log(err))
                     
                  } else { //if entered password is wrong
                     let time=await Account.findOne({where:{email:req.body.email,status:1},attributes:["loginattempt","password_count"]})
                     let message;
                     let blocked;
                     let timestamp;
                     let newArray={};
                     let minutes=moment().add(5,'minutes').unix()
                     let count=time.password_count+1;
                     if(typeof time.password_count!=='undefined' && time.password_count>=3){ //checking if user attempt to login after 3 invalid attempts
                        if(time.loginattempt){ // if already timestamp is available 
                           if(time.loginattempt<=moment().unix()){ //5 minutes are  elapsed
                              Account.update({password_count:1,loginattempt:null},{where:{email:req.body.email}})
                              blocked=false;
                              timestamp='';
                              message='You have entered an invalid password'
                           }else{ // not elapsed
                             let timeLeft= Helper.getMinutesAndSecondFromTimestamp(time.loginattempt,moment().unix())
                              blocked=true;
                              timestamp=time.loginattempt;
                              message='Your account has been freezed for'+timeLeft+'minutes because of a wrong password attempt.'
                           }
                        }else{ //if timestamp is empty
                        Account.update({loginattempt:minutes},{where:{email:req.body.email}})
                        blocked=true;
                        timestamp=minutes;
                        message='Your account has been freezed for 05:00 minutes because of a wrong password attempt.'
                        }
                     }else{ // if user password count is not three
                        if(count>=3){ //if previous count is 2 but we are updating that count to 3 
                           Account.update({loginattempt:minutes,password_count:count},{where:{email:req.body.email}})
                           blocked=true;
                           timestamp=minutes
                           message="Your account has been freezed for 05:00 minutes because of a wrong password attempt."
                        }else{ // if count is not 3
                           Account.update({loginattempt:null,password_count:count},{where:{email:req.body.email}})
                           blocked=false;
                           timestamp=''
                           message="You have entered an invalid password"
                        }
                     }
                     newArray.public_id='';
                     newArray.blocked=blocked;
                     newArray.timestamp=timestamp;
                     newArray.thought='';
                     newArray.subscription_status='';
                     newArray.notification_enrolled='';
                     newArray.profiles=[];
                     newArray.catalogue=[];
                     res.status(400).json({
                        statusCode: 400,
                        action: path,
                        message: message,
                        user: newArray,
                        token: ''
                     });
                  }
               }
               
            }
         }).catch(err => {
            console.log(err)
            res.status(500).send({ statusCode: 500,action: path, message: 'Something Went Wrong' })
         });
      }
   } catch (e) {
     
      res.status(500).json({ statusCode: 400,action: path, message: 'Something Went Wrong' })
   }
}

// verify otp
exports.verifyOtp = async (req, res) => {
   let path=req.route.path?req.route.path.substr(1):'';
   try {
      const v = new Validator(req.body, {
         public_id: 'required|integer',
         otp: 'required|integer'
      })
      const matched = await v.check()
      if (!matched) {
         let public_id=v.errors.public_id?v.errors.public_id.message:"";
         let otp=v.errors.otp?v.errors.otp.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: otp+public_id})
         return;
      } else {
         let otp=await Account.findOne({where:{otp:req.body.otp},attributes:["id"]})
         if(typeof otp!=='undefined' && otp!==null){ //if otp is matched
            let users = await Account.findOne({
               attributes: ['public_id'],
               where: {public_id: req.body.public_id,updatedAt:{[Op.gte]:moment().subtract(15,'m').utc().format()},otp:req.body.otp},
            });
            if (typeof users !== 'undefined' && users !== null) { //if otp is not expired
               bcrypt.hash(Date.now().toString(),10,async (err,hash)=>{
                  await Account.update({ otp: null,reset_password_token:hash ,last_login_date: new Date() },{where:{public_id:req.body.public_id}}) 
                  res.status(200).json({
                     statusCode: 200,
                     action:path,
                     message: "Code validation successfull.",
                     token:hash
                  })
               })
               
            } else { //if otp does not match or expired
               await Account.update({ otp: null }, { where: { public_id: req.body.public_id } })
               res.status(400).json({ statusCode: 400,action:path, message: "This Code has been expired" })
            }  
         }else{
            res.status(400).json({ statusCode: 400,action:path, message: "You have entered wrong code" })
         }
      }
   } catch (e) {
     
      res.status(500).json({ statusCode: 500,action:path, message: 'Something Went Wrong' })
   }
}

exports.getCharity = async (req, res) => {
   let path=req.route.path?req.route.path.substr(1):'';
   try {
      let app_version=req.headers.app_version?req.headers.app_version:'';
      Charity.findAll({
         attributes: ['id', 'name', 'short_description','long_description', 'image', 'createdAt'],
         where: { status: 1 },
         order: [['id', 'DESC']]
      }).then(async charity => {
         if(charity){
            let forceUpdateFlag=await ForceUpdate.findOne({where:{app_version:app_version},attributes:["force_upgrade"]})
            let conditions=await TermConditions.findOne({where:{status:1},attributes:["term_conditions","version"]})
            let charityArr=[];
            charity.forEach((element)=>{
              charityArr.push({
                 'id':element.id,
                 'name':element.name,
                 'short_description':element.short_description,
                 'long_description':element.long_description,
                 "image":element.image,
              });
            });
            let charityResult={};
            charityResult.skip_charity=false;
            charityResult.force_update=forceUpdateFlag?forceUpdateFlag.force_upgrade:false;
            charityResult.charities=charityArr;
            res.status(200).json({ statusCode: 200,action:path, message: "First launch successfull",conditions:conditions ,charities: charityResult })
         }else{
            res.status(404).json({ statusCode: 404,action:path, message: "First launch not successfull",conditions:{}, charities: [] })
         }
      })
   } catch (e) {
      res.status(500).json({ statusCode: 500,action:path, message: 'Something Went Wrong' })
   }
}

exports.forgotPassword = async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
         email: 'required|email',
      })
      const matched = await v.check()
      if(!matched){
         let emailError=v.errors.email?v.errors.email.message:"";
         res.status(422).json({ statusCode: 422,action:path, message: emailError })
         return;
      }else{
         let user= await Account.findOne({where:{email:req.body.email},attributes:["id","public_id"]})
         if(user){
            let profile = await UserProfiles.findOne({where:{AccountId:user.id,status:1},attributes:["name"]})
            let name = profile!==null?profile.name:'';
            let mailOptions = {
               from:'bw21otp@gmail.com',
               to: req.body.email,
               // to:'sfs.chitesh20@gmail.com',
               subject: "One Time Otp",
               html:'<html><head><title></title><link href="https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap" rel="stylesheet"></head>'+ 
               '<body style="margin: 0; padding: 0; font-family: "Poppins",arial, sans-serif;">'+
                   '<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EAECED">'+
                       '<tbody>'+
                           '<tr><td height="20">&nbsp;</td></tr>'+
                           '<tr>'+
                               '<td align="center" valign="top">'+
                                   '<table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="overflow:hidden!important;border-radius:3px" width="700">'+
                                       '<tbody>'+
                                           '<tr>'+
                                               '<td bgcolor="#ffffff" align="center" height="160" style="padding:15px 0">'+
                                                   '<a href="#" target="_blank">'+
                                                       '<img src="http://54.90.62.46:4800/public/logo.png" width="160">'+
                                                   '</a>'+
                                               '</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td>&nbsp;</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td align="center">'+
                                                   '<table width="85%">'+
                                                       '<tbody>'+
                                                           '<tr>'+
                                                              
                                                   '<td align="center">'+
                                                                   '<span style="margin:0!important;font-family: "Poppins",arial, sans-serif !important;font-size:38px;line-height:44px;font-weight:200;color:#252b33; width:100%">'+
                                                                   '<strong> Forgot Password </strong></span>'+ 
                                                                   '<br>'+
                                                               '</td>'+
                                                   
                                                           '</tr>'+
                                                           '<tr>'+
                                                               
                                                   '<td align="center" style="font-size:20px;line-height:38px;font-weight:400;color:#252b33;font-style:italic!important;font-family: "Poppins",arial, sans-serif!important;">'+
                                                                   '<br>Hi <b>'+name+'</b>'+
                                                               '</td>'+
                                                           '</tr>'+
                                                       '</tbody>'+
                                                   '</table>'+
                                               '</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td align="center">'+
                                                   '<table border="0" cellpadding="0" cellspacing="0" width="78%">'+
                                                       '<tbody>'+
                                                           '<tr>'+
                                                               '<td align="center" style="font-size:18px!important;line-height:26px!important;font-weight:400!important;color:#333!important;font-family: "Poppins",arial, sans-serif!important;">'+
                                                                   '<p style="margin: 0;">'+
                                                                       'To reset your password, Please use below 4 digits CODE. The CODE will be expire in after 3 minutes.</p>'+
                                                               '</td>'+
                                                           '</tr>'+
                                                           '<tr>'+
                                                               '<td align="center" style="font-size:60px!important;line-height:80px!important;font-weight:600!important;color:#3B7CC2 !important;font-family: "Poppins",arial, sans-serif!important;">'+
                                                                   '<p style="margin: 20px 0; letter-spacing:10px;">'+otp+'</p>'+
                                                               '</td>'+
                                                           '</tr>'+
                                                       '</tbody>'+
                                                   '</table>'+
                                               '</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               '<td>&nbsp;</td>'+
                                           '</tr>'+
                                           
                                           '<tr>'+
                                               '<td height="30">&nbsp;</td>'+
                                           '</tr>'+
                                           '<tr>'+
                                               
                                       '<td align="center" bgcolor="#ffffff">'+
                                                   '<br>'+
                                                   '<p style="margin-bottom:1em;font-family: "Poppins",arial, sans-serif!important;padding:0!important;margin:0!important;color:#444!important;font-size:12px!important;font-weight:300!important">'+
                                                       '<span>   Email sent by WiseKid Team <br>'+
                                                           '© Copyright-2020 WiseKid, All rights reserved</span></p>'+
                                                           '<br>'+
                                               '</td>'+
                                           '</tr>'+
                                       '</tbody>'+
                                   '</table>'+
                               '</td>'+
                           '</tr>'+
                           '<tr>'+
                               '<td height="20">&nbsp;</td>'+
                           '</tr>'+
                       '</tbody>'+
                   '</table>'+
               '</body>'+
               '</html>'
               // html: '<p>Hi, </p><p>This is your authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
            }
            transporter.sendMail(mailOptions, function(error, info){  //amazon transporter
               if (error) {
                 
                  res.status(500).json({ statusCode:500,action:path, message: "Something Went Wrong" });
               } else {
                  Account.update({ otp: otp }, { where: { id: user.id, status: 1 } })
                  res.status(200).json({
                     statusCode: 200,
                     action:path,
                     message: "A 4-digit code has been sent to your registered email.",
                     public_id: user.public_id
                  });
               }
           });
         }else{
            res.status(409).json({
               statusCode: 409,
               action:path,
               message: 'This email is not registered on wiseKid.'
            }); 
         }
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something Went Wrong' })
   }
}

exports.resetPassword= async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
         public_id: 'required|integer',
         password: 'required',
         token:'required'
      })
      const matched = await v.check()
      if(!matched){
         let public_id=v.errors.public_id?v.errors.public_id.message:"";
         let password=v.errors.password?v.errors.password.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: password+public_id })
         return;
      }else{
        let validateToken= await Account.findOne({where:{reset_password_token:req.body.token,updatedAt:{[Op.gte]:moment().subtract(15,'m').utc().format()}}})
         if(validateToken){ // if token matches + it is not older than 15 minutes
            bcrypt.genSalt(10, async (err, salt) => { //generating password hash
               bcrypt.hash(req.body.password, salt, async (err, hash) => {
                  await Account.update({password:hash,reset_password_date:sequelize.fn('NOW'),reset_password_token:null},{where:{public_id:req.body.public_id}}).then(function(user){
                     expireAllSessions(req.body.public_id)
                     res.status(200).json({ statusCode: 200,action:path, message: "Password Updated!" })
                  }).catch(function(err){
                     res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                  });           
               });
            }); 
         }else{ //if token is not valid or expired
            res.status(400).json({ statusCode: 400,action:path, message: 'This token has been expired' })
         }  
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something Went Wrong' })
   }
}

exports.changePassword = async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
         old_password: 'required',
         new_password: 'required|minLength:8'
      })
      const matched = await v.check()
      if(!matched){
         let old_password=v.errors.old_password?v.errors.old_password.message:"";
         let new_password=v.errors.new_password?v.errors.new_password.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: new_password+old_password })
         return;
      }else{
         if(bcrypt.compareSync(req.body.old_password,req.user.password)){
            bcrypt.genSalt(10, async (err, salt) => { //generating password hash
               bcrypt.hash(req.body.new_password, salt, async (err, hash) => {
                  await Account.update({password:hash},{where:{id:req.user.id}}).then(function(user){
                     expireAllSessions(req.user.public_id); // expiring all the previous sessions
                     //refreshing token for user who is currently logged in
                     let token = jwt.sign(req.user.dataValues, 'secretKey') //generating token
                     makeUserSession(req.user.id,req.headers,token);
                     res.status(200).json({ statusCode: 200,action:path, message: "Password Updated!",token:token })
                  }).catch(function(err){
                     console.log(err);
                     res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                  });           
               });
            });
         }else{
            res.status(404).json({ statusCode: 404,action:path, message: "You have entered an invalid old password." });
         }
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.termsAndConditions= async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      await TermConditions.findOne({where:{status:1},attributes:["term_conditions","version"]}).then((conditions)=>{
         if(!conditions){
            res.status(404).json({ statusCode: 404,action:path, message: "Record not found",result:{} })
         }else{
            res.status(200).json({ statusCode: 200,action:path, message: "Record fetched",result:conditions })
         } 
      }).catch((err)=>{
         res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
      })
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.selectProfile = async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
         password: 'required'
      })
      const matched = await v.check()
      if(!matched){
         let password=v.errors.password?v.errors.password.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: password+profile_id })
         return;
      }else{
         //getting account id info from profile id
         let profile=await Account.findOne({where:{id:req.user.id,status:1},attributes:["id","email","password","loginattempt"]}) 
        
         if(!profile){
            res.status(404).json({ statusCode: 404,action: path, message: "Profile not found" });
         }else{
            if(profile.loginattempt && profile.loginattempt>=moment().unix()){ // if 5 minutes is not elapsed
               let timeLeft= Helper.getMinutesAndSecondFromTimestamp(profile.loginattempt,moment().unix())
                  let newArray={};
                  newArray.blocked=true;
                  newArray.timestamp=profile.loginattempt;
                  res.status(400).json({
                     statusCode: 400,
                     action: path,
                     message: 'Your account has been freezed for '+timeLeft+' minutes because of a wrong password attempt.',
                     result: newArray,
                  });
            }else{
                //account info
               if(bcrypt.compareSync(req.body.password,profile.password)){ //validating password
                  Account.update({loginattempt:null,password_count:0},{where:{email:profile.email}})  
                  res.status(200).json({
                     statusCode: 200,
                     action: path,
                     message: 'Login successful',
                  });
               } else{
                  let time=await Account.findOne({where:{id:profile.id,status:1},attributes:["loginattempt","password_count"]})
                     let message;
                     let blocked;
                     let timestamp;
                     
                     let minutes=moment().add(5,'minutes').unix()
                     let count=time.password_count+1;
                     if(typeof time.password_count!=='undefined' && time.password_count>=3){ //checking if user attempt to login after 3 invalid attempts
                        if(time.loginattempt){ // if already timestamp is available 
                           if(time.loginattempt<=moment().unix()){ //5 minutes are  elapsed
                              Account.update({password_count:1,loginattempt:null},{where:{id:profile.id}})
                              blocked=false;
                              timestamp='';
                              message='You have entered an invalid password'
                           }else{ // not elapsed
                             let timeLeft= Helper.getMinutesAndSecondFromTimestamp(time.loginattempt,moment().unix())
                              blocked=true;
                              timestamp=time.loginattempt;
                              message='Your account has been freezed for '+timeLeft+' minutes because of a wrong password attempt.'
                           }
                        }else{ //if timestamp is empty
                        Account.update({loginattempt:minutes},{where:{id:profile.id}})
                        blocked=true;
                        timestamp=minutes;
                        message='Your account has been freezed for 05:00 minutes because of a wrong password attempt.'
                        }
                     }else{ // if user password count is not three
                        if(count>=3){ //if previous count is 2 but we are updating that count to 3 
                           Account.update({loginattempt:minutes,password_count:count},{where:{id:profile.id}})
                           blocked=true;
                           timestamp=minutes
                           message="Your account has been freezed for 05:00 minutes because of a wrong password attempt."
                        }else{ // if count is not 3
                           Account.update({loginattempt:null,password_count:count},{where:{id:profile.id}})
                           blocked=false;
                           timestamp=''
                           message="You have entered an invalid password"
                        }
                     }
               
                  let newArray={};
                  newArray.blocked=blocked;
                  newArray.timestamp=timestamp;
                  res.status(400).json({
                     statusCode: 400,
                     action: path,
                     message: message,
                     result: newArray,
                  });
               }
            }
           
         }  
      }
   }catch(e){
      console.log(e)
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}
exports.addProfile=async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      let count=0;
      const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
      let profile=[];
      req.body.userProfiles.forEach(async element => {
         count++
         if(element.id==''){ // if id is  empty that means we will create new profile
            profile.push({ //
               'account_type':0, 
               'avatar_id':element.avatar_id,
               'name':element.name,
               'age':element.age,
               'AccountId':req.user.id
             });
         }else{ // otherwise we will update  profile
          await UserProfiles.update({avatar_id:element.avatar_id,name:element.name,age:element.age},{where:{id:element.id}}).then()
         } 
      });

      UserProfiles.bulkCreate(profile).then().catch(err=>{})
      await waitFor(2000);//waiting for creation or updation to complete
      getResult(req.user.id,'addProfile',false,req.headers).then((user)=>{ //getting result
         res.status(200).json({statusCode: 200,action:path, message: 'Profile added successfully',userProfile:user})
      }).catch(err=>{
         console.log(err)
         res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })    
      }) 
       
   }catch(e){
      console.log(e)
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })   
   }    
}

exports.editProfile = async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
        
         profile_id:'required',
         age: 'required',
         name:'required'
      })
      const matched = await v.check()
      if(!matched){
         let avatar_id=v.errors.avatar_id?v.errors.avatar_id.message:"";
         let age=v.errors.age?v.errors.age.message+',':"";
         let name=v.errors.name?v.errors.name.message+',':"";
         let profile_id=v.errors.profile_id?v.errors.profile_id.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: profile_id+name+age+avatar_id})
         return;
      }else{
         await UserProfiles.update({avatar_id:req.body.avatar_id,age:req.body.age,name:req.body.name},{where:{id:req.body.profile_id}}).then((user)=>{
            res.status(200).json({ statusCode: 200,action:path, message: 'Profile updated!' })
         }).catch(err=>{
            res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
         })
      }   
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })   
   }  
}

exports.contactUs= async(req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
     
      const v = new Validator(req.body, {
         subject: 'required',
         message:'required'
      })
      const matched = await v.check()
      if(!matched){
         let subject=v.errors.subject?v.errors.subject.message:"";
         let message=v.errors.message?v.errors.age.message+',':"";
         res.status(422).json({ statusCode: 422,action:path, message: message+subject})
         return;
      }else{
         let query = `SELECT * FROM ContactUs WHERE DATE(createdAt) = CURDATE() AND AccountId=${req.user.id}`;
         Raw.sequelize.query(query).then(([results, metadata])=>{
            if(results.length>2){ //if submitted queries are more than 3
               res.status(400).json({ statusCode: 400,action:path, message:'Sorry, something went wrong'})
            }else{
               Contact.create({AccountId:req.user.id,subject:req.body.subject,message:req.body.message}).then(user=>{
                  let mailOptions = {
                     from:'bw21otp@gmail.com',
                     // to: process.env.ADMIN_EMAIL,
                     to:'sfs.chitesh20@gmail.com',
                     subject: "Contact-Us",
                     html:'<html><head><title></title><link href="https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap" rel="stylesheet"></head>'+
                         '<body style="margin: 0; padding: 0; font-family: "Poppins",arial, sans-serif;">'+
                         '<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EAECED">'+
                         '<tbody>'+
                         '<tr><td height="20">&nbsp;</td></tr>'+
                         '<tr>'+
                         '<td align="center" valign="top">'+
                         '<table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="overflow:hidden!important;border-radius:3px" width="700">'+
                         '<tbody>'+
                         '<tr>'+
                         '<td bgcolor="#ffffff" align="center" height="160" style="padding:15px 0">'+
                         '<a href="#" target="_blank">'+
                         '<img src="http://54.90.62.46:4800/public/logo.png" width="160">'+
                         '</a>'+
                         '</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td>&nbsp;</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td align="center">'+
                         '<table width="85%">'+
                         '<tbody>'+
                         '<tr>'+

                         '<td align="center">'+
                         '<span style="margin:0!important;font-family: "Poppins",arial, sans-serif !important;font-size:38px;line-height:44px;font-weight:200;color:#252b33; width:100%">'+
                         '<strong>  Contact Us </strong></span>'+
                         '<br>'+
                         '</td>'+

                         '</tr>'+
                         '<tr>'+

                         '<td align="center" style="font-size:20px;line-height:38px;font-weight:400;color:#252b33;font-style:italic!important;font-family: "Poppins",arial, sans-serif!important;">'+
                         '<br>'+
                         '</td>'+
                         '</tr>'+
                         '</tbody>'+
                         '</table>'+
                         '</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td align="center">'+
                         '<table border="0" cellpadding="0" cellspacing="0" width="78%">'+
                         '<tbody>'+
                         '<tr>'+
                         '<td align="center" style="font-size:18px!important;line-height:26px!important;font-weight:400!important;color:#333!important;font-family: "Poppins",arial, sans-serif!important;">'+
                         '<p style="margin: 0;">'+
                         '</p>'+req.body.subject+
                         '</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td align="center" style="font-size:60px!important;line-height:80px!important;font-weight:600!important;color:#3B7CC2 !important;font-family: "Poppins",arial, sans-serif!important;">'+
                         '<p style="margin: 20px 0;">'+req.body.message+'</p>'+
                         '</td>'+
                         '</tr>'+
                         '</tbody>'+
                         '</table>'+
                         '</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td>&nbsp;</td>'+
                         '</tr>'+

                         '<tr>'+
                         '<td height="30">&nbsp;</td>'+
                         '</tr>'+
                         '<tr>'+

                         '<td align="center" bgcolor="#ffffff">'+
                         '<br>'+

                         '<br>'+
                         '</td>'+
                         '</tr>'+
                         '</tbody>'+
                         '</table>'+
                         '</td>'+
                         '</tr>'+
                         '<tr>'+
                         '<td height="20">&nbsp;</td>'+
                         '</tr>'+
                         '</tbody>'+
                         '</table>'+
                         '</body>'+
                         '</html>'
                     // html: '<p>Hi, </p><p>This is your authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
                  }
                  transporter.sendMail(mailOptions, function(error, info){  //amazon transporter
                     if (error) {
                        console.log(error)
                     }else {
                        console.log('Mail Sent!')
                     }
                  });
                  res.status(200).json({ statusCode: 200,action:path, message:'Query Submitted'})
               }).catch(err=>{
                  console.log(err)
                  res.status(400).json({ statusCode: 400,action:path, message:'Bad request'})
               })
            }
         })

      }
   }catch(e){
      console.log(e);
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' }) 
   }
}

exports.logout= async (req,res,next)=>{
   try{
      let path=req.route.path?req.route.path.substr(1):'';
      let token=req.headers.authorization.slice(7); // removing bearer from token
      let findToken= await UserDevices.findOne({where:{auth_token:token,status:0}})
      if(findToken){ //if token is already inactive
         res.status(400).json({ statusCode: 400,action:path, message: 'User already logged out' }) 
      }else{
         await UserDevices.update({status:0,auth_token:''},{where:{auth_token:token}})
         res.status(200).json({statusCode: 200,action:path, message: 'User logged out successfully'})
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })  
   }
}

exports.changeAudioMode= async (req,res,next)=>{
   try{
      let path=req.route.path?req.route.path.substr(1):'';
      const v = new Validator(req.body, {
         profile_id: 'required'
      })
      const matched = await v.check()
      if(!matched){
         res.status(400).json({ statusCode: 400,action:path, message: 'Profile id is required' })
      }else{
         let checkAudioMode= await UserProfiles.findOne({where:{id:req.body.profile_id},attributes:["audio_mode"]})
         if(checkAudioMode.audio_mode==1){
            await UserProfiles.update({audio_mode:0},{where:{id:req.body.profile_id}})
            res.status(200).json({ statusCode: 200,action:path, message: 'Audio inactive!'})
         }else if(checkAudioMode.audio_mode==0){
            await UserProfiles.update({audio_mode:1},{where:{id:req.body.profile_id},attributes:["audio_mode"]})
            res.status(200).json({ statusCode: 200,action:path, message: 'Audio active!'})
         }else{
            res.status(400).json({ statusCode: 400,action:path, message: 'Bad request!'})
         }
      } 
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.faqListing= async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      
      let faq_section = await Faq.findAll({where:{status:1},attributes:["faq_section"],group:["faq_section"]})
      if(faq_section.length>0){
         let result=[];
         for(const element of faq_section){
            let questions = await Faq.findAll({where:{status:1,faq_section:element.faq_section},attributes:["faq_questions","faq_answers"]})
            result.push({'section':element.faq_section,'questions':questions})
         }
         res.status(200).json({statusCode: 200,action:path, message: 'List fetched',faq:result})
      }else{
         res.status(404).json({statusCode: 404,action:path, message: 'Not found'})
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.postFeedback= async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{
      const v = new Validator(req.body, {
         message: 'required'
      })
      const matched = await v.check()
      if(!matched){
         res.status(400).json({statusCode: 500,action:path, message: 'Profile id is required'})
      }else{
         let query = `SELECT * FROM AppFeedbacks WHERE DATE(createdAt) = CURDATE() AND AccountId=${req.user.id}`;
         Raw.sequelize.query(query).then(([results, metadata])=>{
            if(results.length>2){ //if submitted queries are more than 3
               res.status(400).json({ statusCode: 400,action:path, message: 'Sorry, something went wrong' })
            }else{
                Feedback.create({feedback:req.body.message,AccountId:req.user.id}).then(user=>{
                   let mailOptions = {
                      from:'bw21otp@gmail.com',
                      // to: process.env.ADMIN_EMAIL,
                      to:'sfs.chitesh20@gmail.com',
                      subject: "Feedback",
                      html:'<html><head><title></title><link href="https://fonts.googleapis.com/css?family=Poppins:400,500&display=swap" rel="stylesheet"></head>'+
                          '<body style="margin: 0; padding: 0; font-family: "Poppins",arial, sans-serif;">'+
                          '<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#EAECED">'+
                          '<tbody>'+
                          '<tr><td height="20">&nbsp;</td></tr>'+
                          '<tr>'+
                          '<td align="center" valign="top">'+
                          '<table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="overflow:hidden!important;border-radius:3px" width="700">'+
                          '<tbody>'+
                          '<tr>'+
                          '<td bgcolor="#ffffff" align="center" height="160" style="padding:15px 0">'+
                          '<a href="#" target="_blank">'+
                          '<img src="http://54.90.62.46:4800/public/logo.png" width="160">'+
                          '</a>'+
                          '</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td>&nbsp;</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td align="center">'+
                          '<table width="85%">'+
                          '<tbody>'+
                          '<tr>'+

                          '<td align="center">'+
                          '<span style="margin:0!important;font-family: "Poppins",arial, sans-serif !important;font-size:38px;line-height:44px;font-weight:200;color:#252b33; width:100%">'+
                          '<strong> Feedback </strong></span>'+
                          '<br>'+
                          '</td>'+

                          '</tr>'+
                          '<tr>'+

                          '<td align="center" style="font-size:20px;line-height:38px;font-weight:400;color:#252b33;font-style:italic!important;font-family: "Poppins",arial, sans-serif!important;">'+
                          '<br>'+
                          '</td>'+
                          '</tr>'+
                          '</tbody>'+
                          '</table>'+
                          '</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td align="center">'+
                          '<table border="0" cellpadding="0" cellspacing="0" width="78%">'+
                          '<tbody>'+
                          '<tr>'+
                          '<td align="center" style="font-size:18px!important;line-height:26px!important;font-weight:400!important;color:#333!important;font-family: "Poppins",arial, sans-serif!important;">'+
                          '<p style="margin: 0;">'+
                          '</p>'+
                          '</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td align="center" style="font-size:60px!important;line-height:80px!important;font-weight:600!important;color:#3B7CC2 !important;font-family: "Poppins",arial, sans-serif!important;">'+
                          '<p style="margin: 20px 0;">'+req.body.message+'</p>'+
                          '</td>'+
                          '</tr>'+
                          '</tbody>'+
                          '</table>'+
                          '</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td>&nbsp;</td>'+
                          '</tr>'+

                          '<tr>'+
                          '<td height="30">&nbsp;</td>'+
                          '</tr>'+
                          '<tr>'+

                          '<td align="center" bgcolor="#ffffff">'+
                          '<br>'+

                          '<br>'+
                          '</td>'+
                          '</tr>'+
                          '</tbody>'+
                          '</table>'+
                          '</td>'+
                          '</tr>'+
                          '<tr>'+
                          '<td height="20">&nbsp;</td>'+
                          '</tr>'+
                          '</tbody>'+
                          '</table>'+
                          '</body>'+
                          '</html>'
                      // html: '<p>Hi, </p><p>This is your authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
                   }
                   transporter.sendMail(mailOptions, function(error, info){ //amazon transporter
                      if (error) {
                         console.log(error)
                      }else {
                         console.log('Mail Sent!')
                      }
                   });
                  res.status(200).json({ statusCode: 200,action:path, message: 'Feedback Posted!' })
               }).catch(err=>{
                  res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
               })
            }
         })
      }    
   }catch(e){
      console.log(e)
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.changeNotificationEnrolled = async (req,res,next)=>{
   let path=req.route.path?req.route.path.substr(1):'';
   try{

      const v = new Validator(req.headers, {
         device_token: 'required'
      })
      const matched = await v.check()
      if(!matched){
         res.status(400).json({statusCode: 400,action:path, message: 'Device token is required'})
      }else{
         let token=req.headers.authorization.slice(7);
         let devices=await UserDevices.findOne({where:{device_token:req.headers.device_token,auth_token:token},attributes:["notification_enrolled"],order:[["id","DESC"]]})
         if( devices && devices.notification_enrolled==0){ // if notification status is inactive
            //activating that device notification
            await UserDevices.update({notification_enrolled:1},{where:{device_token:req.headers.device_token,auth_token:token}}).then(user=>{
               res.status(200).json({statusCode: 200,action:path, message: 'Notification activated!'})
            }).catch(err=>{
               res.status(500).json({statusCode: 500,action:path, message: 'Something Went Wrong'})
            })
         }else if(devices && devices.notification_enrolled==1){
            //deactivating that device notification if already active
            await UserDevices.update({notification_enrolled:0},{where:{device_token:req.headers.device_token,auth_token:token}}).then(user=>{
               res.status(200).json({statusCode: 200,action:path, message: 'Notification deactivated!'})
            }).catch(err=>{
               res.status(500).json({statusCode: 500,action:path, message: 'Something Went Wrong'})
            })
         } else {
            res.status(404).json({statusCode: 404,action:path, message: 'Record not found!'})
         }
      }
   }catch(e){
      console.log(e)
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.webHook = async (req,res,next)=>{
   try{
      let body =  JSON.stringify(req.body) // body sent by server

      // if(req.body.environment.toString().localeCompare("Sandbox")){ //checking if environment is testing
      //
      // }else if(req.body.environment.toString().localeCompare("PROD")){ // checking if enviornment is production
      //
      // }
      // //notification status or subscription status
      // if(req.body.notification_type.toString().localeCompare("DID_CHANGE_RENEWAL_STATUS")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("CANCEL")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("DID_CHANGE_RENEWAL_PREF")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("DID_FAIL_TO_RENEW")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("DID_RECOVER")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("INITIAL_BUY")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("INTERACTIVE_RENEWAL")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("RENEWAL")){
      //
      // }else if(req.body.notification_type.toString().localeCompare("REFUND")){
      //
      // }
      let latest_receipt=req.body.latest_receipt_info;
      let subscription = await Subscription.findOne({where:{original_transaction_id:latest_receipt.original_transaction_id}})
      let plan_start_date=latest_receipt.purchase_date_ms.toString();
      let expire_date=latest_receipt.expires_date.toString();
      let expiration_intent=latest_receipt.expiration_intent?latest_receipt.expiration_intent:0;
      let platform=0;
      //creating transaction record
      await Transaction.create({'amount':0,'transaction_id':latest_receipt.transaction_id,platform:0})
      if(!subscription){ //if subscription is not there in our db
         await Subscription.create({'subscription_type':0,'start_date':plan_start_date,'end_date':expire_date,'expiration_reason':expiration_intent,'platform':platform})
      }else{ //if subscription is present
         await Subscription.update({'subscription_type':0,'start_date':plan_start_date,'end_date':expire_date,'expiration_reason':expiration_intent,'platform':platform},{where:{original_transaction_id:latest_receipt.original_transaction_id}})
      }
   }catch(e){
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}

exports.validateReceipt = async (req,res,next)=>{
   try{
      let body={
         title:'Badge earned',
         message:'Chitesh has earned a badge',
         notification_type:'badge_earned',
         group:'1',
         account_id:'400',
         profile_id:'607'
      };
      Helper.sendNotification(['ffQOeurP50P1oOcanXiXK1:APA91bEcUH7UIFJBCaRAfgpvcOzBHaAS2C2fT3fAeSGAM69qnVhlxT68pCTVg6RGM85UImx1EtZvScTwvNEmgbORlfhTKarmgC0ROq3sESuNBrMvRnG7gaV8V_aSiBWGsT-Anq0pep9X'],body)
   }catch (e) {
      console.log
      res.status(500).json({ statusCode: 500,action:path, message: 'Something went wrong' })
   }
}