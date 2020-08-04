// call models file
const db = require('../../../models')
// require sequelize query operators
const sequelize=require("sequelize")
const moment = require('moment')
const { Op } = require("sequelize")
// validator
const { Validator } = require('node-input-validator')
// require model with models file db instance
const ReadStory=db.Read_stories
const FavouriteStory=db.Favourite_stories
const Story=db.Story
const Raw=require('../../../models/index')
const StoryCategory=db.Story_category
const IllustrateImage=db.IllustrateImage
const StoryQuestions=db.StoryQuestions
const StoryQuestionsAnswer=db.StoryQuestionsAnswer
const ProfileValue=db.ProfileValue
const UserBadges=db.UserBadges
const UserProfiles=db.UserProfile
const UserDevices=db.UserDevice
const Badge=db.Badge
const ValueTag=db.ValueTag
const Account= db.Account
const Thoughts=db.Thoughts
const StoryPages=db.StoryPages
const StoryImages=db.StoryImages
const StoryValueTags=db.StoryValueTag
const StoryCharacterTags=db.StoryCharacterTag
const UserEarnedPoints=db.UserEarnedPoints
const ForceUpdate=db.ForceUpdate
const CharacterTag = db.CharacterTag
const Notifications = db.Notifications
var async = require("async");
let Helper=require('../../helpers/Helper');
require('dotenv').config()

exports.home=async(req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):''
    try{
        let headers=req.headers;
        let users =await Account.findOne(
                    {where:{id:req.user.id},
                    attributes: ['public_id','subscription_status',"loginattempt"],
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
                                ],
                                
                            },
                        ],
                       
        })
      
        let allStories =await StoryCategory.findAll({
                    attributes:[['name','cat_name']],
                    where:{status:1},
                    include:[{model:Story,as: 'stories',where:{status:1},required:true,attributes:["id","title",["catalogue_image","thumbnail_image"],"locked","video_url"]}] 
        })
        let thought=await Thoughts.findOne({where:{status:1},attributes:["thought"]})
        let notific
        if(notific){
            notific=await UserDevices.findOne({where:{device_token:headers.device_token},attributes:["notification_enrolled"]})
        }
        
        let profiles=[];
        if(users.user_profiles.length>0){
            let user_profiles=users.user_profiles;
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
                    Helper.multisort(element.read_stories,['id'],['DESC'])
                    element.read_stories.map(obj=>{
                       if(obj['liked']==1){ //checking if story liked by that profile
                            liked_stories.push(obj['StoryId'])
                        }
                        if(obj['status']==1 ){ //continue reading array
                            continue_reading.push(obj['StoryId'])
                        }else if(obj['status']==2){ // read stories array
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
                    
            //making new set object to override vals
            let newArray={};
            let app_version= headers.app_version?headers.app_version:'';
            let forceUpdateFlag=await ForceUpdate.findOne({where:{app_version:app_version},attributes:["force_upgrade"]})

            newArray.public_id=users.public_id;
            newArray.force_upgrade=forceUpdateFlag?forceUpdateFlag.force_upgrade:false;
            newArray.thought=thought?thought.thought:'';
            newArray.maximum_points=50;
            newArray.subscription_status=users.subscription_status;
           
            newArray.notification_enrolled=notific?notific.notification_enrolled==1?true:false:false;
            newArray.profiles=profiles;
            newArray.catalogue=allStories;
            res.status(200).json({statusCode: 200,action: path, message: 'Data Fetched Successfully',userProfile:newArray})     
        }
        
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.addReadStory = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        let inputs=req.body;
        let story_id=inputs.story_id?inputs.story_id:null
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required',
        })
       
         const matched = await v.check()
         let story_message=v.errors.story_id?v.errors.story_id.message:"";
         let profile_message=v.errors.profile_id?v.errors.profile_id.message+',':"";
         if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: profile_message+story_message})
            return;
         } else {
            let findStory= await ReadStory.findOne({where:{UserProfileId :inputs.profile_id,StoryId:story_id}})

             if(!findStory){ //if same profile id and story id is not present
                 await ReadStory.create({ UserProfileId :inputs.profile_id,StoryId:story_id}).then((user)=>{
                     res.status(200).json({statusCode:200,action:path,message:'Story added to read!'});
                 }).catch((err)=>{

                     res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                 })
             }else{ // if present then we will update its page
                 let status=findStory.status==2 || findStory.status==3 ?3:1
                 await ReadStory.update({status:status},{where:{UserProfileId :inputs.profile_id,StoryId:story_id}}).then((user)=>{
                     res.status(200).json({statusCode:200,action:path,message:'Story updated!'});
                 }).catch((err)=>{
                     console.log(err)
                     res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                 })
             }
            
         }
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.removeFromReading = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    let inputs=req.body;
    try{
        let story_id=inputs.story_id?inputs.story_id:null
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required',
        })

        const matched = await v.check()
        let story_message=v.errors.story_id?v.errors.story_id.message:"";
        let profile_message=v.errors.profile_id?v.errors.profile_id.message+',':"";
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: profile_message+story_message})
            return;
        } else {
            let findStory= await ReadStory.findOne({where:{UserProfileId :inputs.profile_id,StoryId:story_id}})
            if(findStory){
                await ReadStory.update({status:2},{where:{UserProfileId :inputs.profile_id,StoryId:story_id}}).then((user)=>{
                    res.status(200).json({statusCode:200,action:path,message:'Story removed from continue reading!'});
                }).catch((err)=>{
                    console.log(err)
                    res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                })
            }else{
                res.status(404).json({statusCode:404,action:path,message:'Story not found'});
            }
        }
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.addFavouriteStory = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        let inputs=req.body;
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required'
        })
        const matched = await v.check()
        let story_message=v.errors.story_id?v.errors.story_id.message:"";
        let profile_message=v.errors.profile_id?v.errors.profile_id.message+',':"";
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: profile_message+story_message})
            return;
        } else {
            let favStory = await FavouriteStory.findOne({where:{ UserProfileId:req.body.profile_id,StoryId:req.body.story_id}})
            if(!favStory){
                await FavouriteStory.create({ UserProfileId:req.body.profile_id,StoryId:req.body.story_id}).then((user)=>{
                    res.status(200).json({statusCode:200,action:path,message:'Story added to favourites!'});
                }).catch((err)=>{
                    res.status(500).json({ statusCode: 500,action:path, message: "Something went wrong" })
                })
            }else{
                await FavouriteStory.destroy({where:{UserProfileId:req.body.profile_id,StoryId:req.body.story_id}})
                res.status(200).json({ statusCode: 200,action:path, message: "Story removed from favourites!" })
            }
            
        }
    }catch(e){
        res.status(500).json({ statusCode: 500,action: path, message: 'Something Went wrong' })
    }
}

exports.storyDetail = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required'
        })
        const matched = await v.check()
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: "Story id is required.", validation_error: v.errors })
            return;
        }else{ 
            let storyDetail = await Story.findOne({
                               attributes:["id","title","text","story_audio_url","button_color","audio_flag","points","synopsis_content","synopsis_image","locked","synopsis_audio_url","ipad_image","tablet_image"],
                               where:{id:req.body.story_id,status:1},
                               include:[{model:ReadStory,required:false,where:{UserProfileId:req.body.profile_id,StoryId:req.body.story_id},attributes:["StoryPageId","liked","status"]},
                                        {model:StoryImages,required:false,attributes:["count","image","ipad_image","tablet_image"]},
                                        {model:StoryQuestions,where:{question_type:{[Op.in]:[1,2]}},required:false,attributes:["question_text","question_type"],
                                            include:[{model:StoryQuestionsAnswer,as:'answers',where:{status:1},required:false,attributes:["answer_text","answer_status"]}]
                                        },
                                        {model:StoryValueTags,required:false,where:{status:1,StoryId:req.body.story_id},attributes:["id","ValueTagId"]},    
                                        {model:FavouriteStory,required:false,where:{status:1,UserProfileId:req.body.profile_id,StoryId:req.body.story_id },attributes:["id"]}
                                    ]
            });
            // console.log(storyDetail.dataValues.story_audio_url);
            if(!storyDetail){ //if record not exists
                res.status(404).json({statusCode:404,action:path,message:'Detail not found!',result:{}})
            }else{ // if record exists
                let storyReadStatus;
                if(storyDetail.Read_stories.length>0){
                    storyReadStatus= storyDetail.Read_stories[0].status==1 || storyDetail.Read_stories[0].status==3?true:false;
                }
                let storyDetailResult={};
                storyDetailResult.id=storyDetail.id
                storyDetailResult.title=storyDetail.title
                storyDetailResult.button_color=storyDetail.button_color
                storyDetailResult.audio_flag=storyDetail.audio_flag
                storyDetailResult.points=storyDetail.points
                storyDetailResult.synopsis_audio_url=storyDetail.synopsis_audio_url
                storyDetailResult.story_audio_url=storyDetail.dataValues.story_audio_url?storyDetail.dataValues.story_audio_url:''
                storyDetailResult.synopsis_content=storyDetail.synopsis_content
                storyDetailResult.thumbnail_image=storyDetail.synopsis_image?storyDetail.synopsis_image:''
                storyDetailResult.ipad_image=storyDetail.ipad_image?storyDetail.ipad_image:''
                storyDetailResult.tablet_image=storyDetail.tablet_image?storyDetail.tablet_image:''
                storyDetailResult.is_fav=storyDetail.Favourite_stories.length>0?true:false,
                storyDetailResult.is_like=storyDetail.Read_stories.length>0?storyDetail.Read_stories[0].liked==1?true:false:false;
                storyDetailResult.is_story_completed=storyDetail.Read_stories.length>0?storyDetail.Read_stories[0].status==2?true:false:false;
                storyDetailResult.locked=storyDetail.locked
                storyDetailResult.is_story_read=storyReadStatus
                storyDetailResult.story_text=storyDetail.dataValues.text?storyDetail.dataValues.text:''
                storyDetailResult.images=storyDetail.StoryImages.length>0?storyDetail.StoryImages:[]
                storyDetailResult.questions=storyDetail.StoryQuestions.length>0?storyDetail.StoryQuestions:[]
                storyDetailResult.story_values=storyDetail.StoryValueTags.length?storyDetail.StoryValueTags.map(obj=>obj['ValueTagId']):[]
                res.status(200).json({statusCode:200,action:path,message:'Detail fetched!',result:storyDetailResult})
            }
        }
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message:'Something went wrong' })
    }
}

exports.popularStoriesAndTags = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        let popularTags = await ValueTag.findAll({where:{status:1},order:[['id','DESC']],attributes:["name"]})
        let characterTags = await CharacterTag.findAll({where:{status:1},attributes:["name","icon_url"]})
        let resultObject={};
        resultObject.valueTags=popularTags.length>0?popularTags.map(obj=>obj['name']):[];
        resultObject.characterTags=characterTags.length>0?characterTags:[];
        res.status(200).json({statusCode: 200,action: path, message: 'List Fetched',result:resultObject});
    }catch(e){
        res.status(500).json({ statusCode: 500,action: path, message:'Something went wrong' })
    }
}

exports.searchStories = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        let pagination=process.env.PAGINATION;
        let skip=req.body.page_count*process.env.PAGINATION;
        let search_key=req.body.search_key?req.body.search_key:'';
      
        const v = new Validator(req.body, {
            search_key: 'required',
        })
        const matched = await v.check()
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: "Search key is required.", validation_error: v.errors })
            return;
        }else{
            let stories
            stories=`SELECT Stories.id,Stories.status,Stories.title,Stories.catalogue_image as thumbnail_image,Stories.locked,Stories.video_url FROM Stories
                    LEFT JOIN Story_categories ON Stories.StoryCategoryId=Story_categories.id
                    LEFT JOIN StoryCharacterTags ON Stories.id=StoryCharacterTags.StoryId
                    LEFT JOIN StoryValueTags ON Stories.id=StoryValueTags.StoryId
                    LEFT JOIN CharacterTags ON StoryCharacterTags.CharacterTagId=CharacterTags.id
                    LEFT JOIN ValueTags ON StoryValueTags.ValueTagId=ValueTags.id
                    WHERE Stories.title LIKE '%${search_key}%' OR Stories.search_keywords LIKE '%${search_key}%' 
                    OR Story_categories.name LIKE  '%${search_key}%' OR CharacterTags.name LIKE '%${search_key}%' 
                    OR ValueTags.keywords LIKE '%${search_key}%' GROUP BY Stories.id;`
            
            Raw.sequelize.query(stories).then(([results, metadata]) => {
                 let searchResult=[];
                if(results.length>0){
                    results.forEach((element)=>{
                        if(element.status===1){ // filter to push only active stories
                            searchResult.push({
                                id:element.id,
                                title:element.title,
                                thumbnail_image:element.thumbnail_image,
                                locked:element.locked==1?true:false,
                                video_url:element.video_url
                            })
                        }
                    })
                }
              res.status(200).json({statusCode: 200,action: path, message: 'Records fetched!',searchResult:searchResult})
            })

        }
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.likeStory = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required'
        })
        const matched = await v.check()
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: "Story id is required." })
            return;
        }else{
            let readyStory=await ReadStory.findOne({where:{StoryId:req.body.story_id,UserProfileId:req.body.profile_id,liked:true},attributes:["id"]})
            if(!readyStory){ //if story is not already liked by user
                await ReadStory.update({liked:true},{where:{StoryId:req.body.story_id,UserProfileId:req.body.profile_id}}).then((user)=>{
                    res.status(200).json({ statusCode: 200,action: path, message: 'Story likes successfully!' })
                }).catch(err=>{
                   
                    res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
                })
            }else{
                res.status(400).json({ statusCode: 400,action: path, message: 'Story already liked!'})
            }
        }
    }catch(e){
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.commentStory = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        const v = new Validator(req.body, {
            story_id: 'required',
            comment:'required'
        })
        const matched = await v.check()
        let story_message=v.errors.story_id?v.errors.story_id.message:"";
        let comment_message=v.errors.comment?v.errors.comment.message+',':"";
        let profile_id=v.errors.profile_id?v.errors.profile_id.message+',':"";
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: profile_id+comment_message+story_message })
            return;
        }else{
            await ReadStory.update({feedback_text:req.body.comment},{where:{StoryId:req.body.story_id,UserProfileId:req.body.profile_id}}).then(async (user)=>{
                res.status(200).json({ statusCode: 200,action: path, message: 'Comment added!' })
            }).catch(err=>{
                res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
            })
        }
    }catch(e){
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.addPoints=async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        const v = new Validator(req.body, {
            story_id: 'required',
            profile_id:'required'
        })
        const matched = await v.check()

        let profile_id=v.errors.profile_id?v.errors.profile_id.message+',':"";
        let story_id=v.errors.story_id?v.errors.story_id.message+',':"";
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: story_id+profile_id })
            return;
        }else{
            //Posting comments
            if(req.body.comment!=''){
                await ReadStory.update({feedback_text:req.body.comment},{where:{StoryId:req.body.story_id,UserProfileId:req.body.profile_id}});
            }
            
            let updated_points;
            let question_attempts=req.body.question_attempts?req.body.question_attempts:0;
            let per_question_points=5; // we will later get this from db
            let pointsForQuestion=question_attempts*per_question_points;
            let earnedPoints=await UserEarnedPoints.findOne({where:{UserProfileId:req.body.profile_id,StoryId:req.body.story_id},attributes:["id"]})
            await ReadStory.update({status:2,StoryPageId:null},{where:{UserProfileId:req.body.profile_id,StoryId:req.body.story_id}})
            //creating notification
            let profile=await UserProfiles.findOne({where:{id:req.body.profile_id,account_type:0},attributes:["name","AccountId"]})
            if(profile){ //if profile is child
                let title="Story Read";
                let message=`${profile?profile.name:''} have completed reading book`;
                let notification_type='read_story';
                let profile_name=profile.name;
                let accountId=profile?profile.AccountId:0;
                await Notifications.create({'title':title,'message':message,'timezone':req.headers.timezone,'profile_name':profile_name,'notification_type':notification_type,'AccountId':accountId,'UserProfileId':req.body.profile_id});
            }
            if(earnedPoints){// already points were given to user for reading the same story
                res.status(200).json({statusCode: 204,action: path, message: 'Points already given for reading same story'})
            }else{ // points not given for same story
                // updating story read status to read completion
                // fetching story value tag id
                let tag=await StoryValueTags.findAll({where:{StoryId:req.body.story_id},attributes:["ValueTagId"]}) 
                let story = await Story.findOne({where:{id:req.body.story_id},attributes:["points"]}) // getting points to be given to user
                let tag_id=tag?tag.ValueTagId:0;
                let storyPoints = story?story.points:0;
                let questionPoints=pointsForQuestion;
                let total_points=storyPoints+questionPoints
                //updating profileValues
                tag.forEach(async (element)=>{
                    let profile=await ProfileValue.findOne({where:{UserProfileId:req.body.profile_id,ValueTagId:element.ValueTagId},attributes:["point"]}) //checking if already user have points
                
                    if(profile){ //if user is earning points from same value tag so we will update 
                        updated_points=profile.point+parseInt(total_points);
                        await ProfileValue.update({point:updated_points},{where:{UserProfileId:req.body.profile_id,ValueTagId:element.ValueTagId}})
                    }else{ // if user has no points
                        updated_points=total_points
                        await ProfileValue.create({point:updated_points,UserProfileId:req.body.profile_id,ValueTagId:element.ValueTagId})
                    }
                })
                
                
                //making array for transactions
                let userEarnedPoints
                // if question points are zero so we will not add questionpoint into array
                if(questionPoints==0){ 
                    userEarnedPoints=[
                        {Points:storyPoints,Point_for:0,UserProfileId:req.body.profile_id,StoryId:req.body.story_id}
                    ];
                }else{
                    userEarnedPoints=[
                        {Points:storyPoints,Point_for:0,UserProfileId:req.body.profile_id,StoryId:req.body.story_id},
                        {Points:questionPoints,Point_for:1,UserProfileId:req.body.profile_id,StoryId:req.body.story_id},
                    ];
                }
                // making transaction for giving points to user
                await UserEarnedPoints.bulkCreate(userEarnedPoints) 
                //updating user Profile points
                await UserProfiles.findOne({where:{id:req.body.profile_id},attributes:["points"]}).then(async user=>{
                    if(user)
                    await UserProfiles.update({points:parseInt(total_points)+user.points},{where:{id:req.body.profile_id}}) // updating points in user profiles
                }).catch(err=>console.log(err))
                //assigning badges to user
                let userbadges= await UserBadges.findAll({where:{UserProfileId:req.body.profile_id},attributes:["BadgeId"]})
                let badgesId=[];
                if(userbadges.length>0){
                    userbadges.forEach(element => { //getting id's of badges which are already given
                        badgesId.push(element.BadgeId)    
                    });
                } 
               
                //fetching badges which were not given to user
                let badges=await Badge.findAll({where:{points:{[Op.lte]:updated_points},id:{[Op.notIn]:badgesId}},attributes:["id","name","icon_url"]}) 
                let badgesArray=[];
                let notificationArray=[];
                if(badges.length>0){
                    badges.forEach(element=>{
                        //creating notification for earning badges
                        if(profile){ //if profile is child
                            notificationArray.push({
                                title:'Badge earned',
                                message:`${profile?profile.name:''} has earned ${element.name} badge`,
                                timezone:req.headers.timezone,
                                notification_type:'badge_earned',
                                AccountId:profile.AccountId,
                                profile_name:profile.name,
                                UserProfileId:req.body.profile_id
                            })
                        }

                        badgesArray.push({
                            BadgeId:element.id,
                            UserProfileId :req.body.profile_id
                        })
                    })
                }
                await Notifications.bulkCreate(notificationArray); //creating notification
                await UserBadges.bulkCreate(badgesArray); //creating badges record
                let vals=await ProfileValue.findAll({where:{UserProfileId:req.body.profile_id},attributes:["id","point"],
                                include:[{model:ValueTag,as:'tags',required:false,attributes:["name","color"]}]})
                let result={};
                result.points=total_points;
                let earnBadges=[];
                if(badges.length>0){
                    badges.forEach((element)=>{
                        earnBadges.push({'id':element.id,'name':element.name,'icon_url':element.icon_url,'latest_badge':true})
                    })  
                }
                let values=[];
                for (const element of vals){

                    values.push({
                        'id':element.id?element.id:'',
                        'name':element.tags?element.tags.name:'',
                        'points':element.point?element.point:'',
                        'color':element.tags?element.tags.color:''
                    })
                }
                result.badges=earnBadges
                result.profile_val=values
                res.status(200).json({ statusCode: 200,action: path, message: 'Points Added',result:result })
            } 
        }        
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.checkNewRecords = async (req,res,next)=>{

    let path=req.route.path?req.route.path.substr(1):'';
    try{  
        let story=await Story.findOne({where:{status:1,createdAt:{
            // [Op.gt]: new Date(),
            [Op.gte]: new Date(new Date() - 1000*60)
       }},attributes:["id","createdAt"],order:[["id","desc"]]})
     
       if(story){
            res.status(200).json({statusCode:200,action:path,message:'New Change Present',change:true})
       }else{
            res.status(200).json({statusCode:200,action:path,message:'New Change not Present',change:false})
       }
    }catch(e){
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}

exports.getStoriesReadByProfile = async (req,res,next)=>{
    let path=req.route.path?req.route.path.substr(1):'';
    try{
        const v = new Validator(req.body, {
            profile_id:'required'
        })
        const matched = await v.check()

        let profile_id=v.errors.profile_id?v.errors.profile_id.message:"";
        if (!matched) {
            res.status(422).json({ statusCode: 422,action: path, message: profile_id })
            return;
        }else{
            let stories= await ReadStory.findAll({where:{UserProfileId :req.body.profile_id,status:{[Op.in]:[2,3]}},
                         include:[{model:Story,attributes:['id','video_url','title','synopsis_content','catalogue_image','synopsis_image'],required:false,
                                    // include:[{model:StoryQuestions,attributes:["question_text"],required:false,where:{question_type:3,status:1}}]
                                 },
                                 {model:UserProfiles,attributes:["name"],required:false}]
            })
          
            if(stories.length>0){
                let result=[];
                for(const element of stories){

                    let questions = await StoryQuestions.findOne({where:{StoryId:element.Story.id,status:1,question_type:2},attributes:["question_text"]})
                    result.push({
                                 'id':element.Story?element.Story.id:'',
                                 'name':element.UserProfile?element.UserProfile.name:'',
                                 'comment':element.feedback_text?element.feedback_text:'',
                                 'title':element.Story?element.Story.title:'',
                                 'synopsis_content':element.Story?element.Story.synopsis_content:'',
                                 'thumbnail_image':element.Story?element.Story.catalogue_image:'',
                                 'synopsis_image':element.Story?element.Story.synopsis_image:'',
                                 'video_url':element.Story?element.Story.video_url:'',
                                 'story_question':questions?questions.question_text:""
                                 // 'story_questions':element.Story.StoryQuestions.length>0?element.Story.StoryQuestions.map((o)=>o["question_text"]):[]
                    }); 
                }
                res.status(200).json({statusCode:200,action:path,message:'Stories list fetched successfully',storyProfileResult:result})
            }else{
                res.status(404).json({ statusCode: 404,action: path, message: 'Stories not found' })
            }   
        }
    }catch(e){
        console.log(e)
        res.status(500).json({ statusCode: 500,action: path, message: 'Something went wrong' })
    }
}