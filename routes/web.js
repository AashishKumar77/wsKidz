const express = require('express')
const route = express.Router()

const adminController = require('../app/controllers/AdminController')
const storyController = require('../app/controllers/StoryController')
const auth = require('../app/controllers/middleware/adminAuth')

route.post('/login', adminController.login)
route.put('/verify/otp', adminController.verifyOtp)
route.post('/forgot/password', adminController.forgotPassword)
route.post('/reset/forgot/password', adminController.resetForgotPassword)

// auth routes
route.put('/change/password', auth, adminController.changePassword)
route.put('/update/profile', auth, adminController.updateProfile)
route.get('/profile/get', auth, adminController.getProfile)
route.post('/valuetag/create', auth, adminController.valuetagCreate)
route.get('/valuetags', auth, adminController.getValueTags)
route.put('/valuetag/active/inactive/:tag_id', auth, adminController.activeInactiveValueTag)
route.delete('/valuetag/delete/:tag_id', auth, adminController.deleteValueTag)
route.post('/charactertag/create', auth, adminController.charactertagCreate)
route.get('/charactertags', auth, adminController.getCharacterTags)
route.put('/charactertag/active/inactive/:tag_id', auth, adminController.activeInactiveCharacterTag)
route.delete('/charactertag/delete/:tag_id', auth, adminController.deleteCharacterTag)
route.post('/charity/create', auth, adminController.charityCreate)
route.get('/charities/get', auth, adminController.getCharity)
route.put('/charity/active/inactive/:tag_id', auth, adminController.activeInactiveCharityTag)
route.delete('/charity/delete/:charity_id', auth, adminController.deleteCharity)
route.post('/badge/create', auth, adminController.badgeCreate)
route.get('/badges/get', auth, adminController.getBadge)
route.put('/badge/active/inactive/:badge_id', auth, adminController.activeInactiveBadge)
route.delete('/badge/delete/:badge_id', auth, adminController.deleteBadge)
route.post('/story/category/create', auth, adminController.storyCategoryCreate)
route.get('/story/category/get', auth, adminController.getStoryCategory)
route.put('/story/category/active/inactive/:category_id', auth, adminController.activeInactiveStoryCategory)
route.delete('/story/category/delete/:category_id', auth, adminController.deleteStoryCategory)
route.post('/terms-of-use/create', auth, adminController.createTermsOfUse)
route.get('/terms-of-use/get', auth, adminController.getTermsOfUse)
route.delete('/terms-of-use/delete/:term_id', auth, adminController.deleteTermsOfUse)
route.post('/faq/create', auth, adminController.createFaq)
route.get('/faq/get', auth, adminController.getAllFaq)
route.get('/faq/get/:faq_id', auth, adminController.getFaq)
route.get('/faqSection/get', auth, adminController.getAllFaqSection)


// story
route.get('/valuetags/get',  storyController.getValueTags)
route.get('/charactertags/get',  storyController.getCharacterTags)
route.get('/category/get',  storyController.getCategory)
route.post('/story/create', auth, storyController.createStory)
route.put('/story/edit', auth, storyController.updateStory)
route.get('/story/get', auth, storyController.getStory)
route.put('/story/active/inactive/:story_id', auth, storyController.activeInactiveStory)
route.delete('/story/delete/:story_id', auth, storyController.deleteStory)
route.delete('/story/delete/image/:id', auth, storyController.deleteStoryId)

route.put('/story/audioflag/on/off/:story_id', auth, storyController.onOffAudioFlag)
route.put('/story/locked/on/off/:story_id', auth, storyController.onOffLocked)
route.get('/auto/search/keywords/:valuetag_id', auth, storyController.autoSearchKeywords)
route.get('/story/page/get/:story_id', auth, storyController.getAllStoryPage)

route.get('/story/images/:story_id', auth, storyController.getAllStoryPageImages)
route.post('/story/page/create', auth, storyController.createStoryPage)
route.post('/story/page/createimages', auth, storyController.createStoryPageImages)

route.put('/story/page/edit', auth, storyController.updateStoryPage)
route.get('/story/page/get/:page_id', auth, storyController.getStoryPage)

route.get('/story/questions/get/:story_id', auth, storyController.getAllStoryQuestion)
route.post('/story/question/create', auth, storyController.createUpdateStoryQA)
route.get('/story/question/get/:storyQuestionsId', auth, storyController.getStoryQuestion)




module.exports = route



