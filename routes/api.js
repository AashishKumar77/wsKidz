const express = require('express')
const route = express.Router()

const userController = require('../app/controllers/api/UserController');
const storyController=require('../app/controllers/api/StoryController');
const auth = require('../app/controllers/middleware/auth')
const session =require('../app/controllers/middleware/session')

route.post('/register', userController.register)
route.post('/login', userController.login)
route.post('/checkEmail',userController.checkEmailUniqueness)
route.post('/verifyOtp', userController.verifyOtp)
route.get('/firstLaunch', userController.getCharity)
route.post('/forgotPassword', userController.forgotPassword)
route.get('/termsAndConditions',userController.termsAndConditions)
route.post('/selectProfile',auth,session,userController.selectProfile)
route.post('/audioSetting',auth,session,userController.changeAudioMode)
route.get('/faq',auth,session,userController.faqListing)
route.post('/feedback',auth,session,userController.postFeedback)
route.post('/contactUs',auth,session,userController.contactUs)
route.post('/changeNotificationEnrolled',auth,session,userController.changeNotificationEnrolled)
route.get('/logout',auth,session,userController.logout)
// auth routes
route.post('/resetPassword',userController.resetPassword)
route.post('/changePassword',auth,session,userController.changePassword)
route.post("/addProfile",auth,session,userController.addProfile)
route.post("/editProfile",auth,session,userController.editProfile)
// Story Routes
route.post('/storyRead',auth,session,storyController.addReadStory)
route.post('/removeStory',auth,session,storyController.removeFromReading)
route.post('/storiesByProfile',auth,session,storyController.getStoriesReadByProfile)
route.post('/storyFavourite',auth,session,storyController.addFavouriteStory)
route.post('/storyDetail',auth,session,storyController.storyDetail)
route.get('/preSearch',auth,session,storyController.popularStoriesAndTags)
route.post('/search',auth,session,storyController.searchStories)
route.post('/storyLike',auth,session,storyController.likeStory)
route.post('/storyComment',auth,session,storyController.commentStory)
route.post('/completeStory',auth,session,storyController.addPoints)
route.get('/checkNewRecords',storyController.checkNewRecords)
route.get('/home',auth,session,storyController.home)
route.get('/testing',userController.validateReceipt);

//Webhook
route.post('/appleWebHook',userController.webHook)
route.post('/validateReceipt',userController.validateReceipt)
module.exports = route