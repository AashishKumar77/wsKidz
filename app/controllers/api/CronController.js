let cron = require('node-cron');
let CronJob = require('cron').CronJob;
const db = require('../../../models')
const sequelize = require('sequelize');
const Notifications = db.Notifications;
const UserDevice = db.UserDevice;
const Helper = require('../../helpers/Helper');
const Subscription = db.Subscription
let moment = require('moment');
const { Op } = require("sequelize")
const Raw=require('../../../models/index')

async function getDeviceTokensAndSendNotification(account_id){

    let userTokens=await UserDevice.findAll({where:{AccountId:account_id,notification_enrolled:1},attributes:["device_token","notification_enrolled"]})

    let tokens= userTokens.map(obj=>obj["device_token"])
    Helper.sendNotification(tokens);
}
async function updateNotification(notification_id){
    await Notifications.update({status:1},{where:{id:notification_id}})
}

async function updateGroupNotification(account_id,notification_type){
    await Notifications.update({status:1},{where:{AccountId:account_id,notification_type:notification_type}})
}
function checkUnsentNotification(){
    return new Promise((resolve,reject)=>{

        Notifications.findAll({where:{status:0},attributes:["AccountId","timezone"],group:["AccountId","timezone"]}).then(user=>resolve(user)).catch(err=>reject(err))
    });
}
// notification according to timezone on 6PM evening on every timezone present
let unsent=checkUnsentNotification()

unsent.then(async result=>{
    for(const element of result){
        let job = new CronJob('00 18 * * *', async function() {
            let notification = await Notifications.findAll({where:{status:0,AccountId:element.AccountId},attributes:["id","AccountId","UserProfileId","notification_type","title","message","profile_name","timezone"]})
            let badge_notification_message='';
            let read_story_notification_message='';
            //grouping into one notification read_story and badge earned if there are multiple records

            for(const ele of notification){
                if(ele.notification_type=='read_story'){
                    read_story_notification_message += ele.profile_name+'&'
                }else if(ele.notification_type=='badge_earned'){
                    badge_notification_message += ele.profile_name+'&'
                }
            }
            //    let tokenArray=[];
            let tokenArray=[
                'dsCrgVwtFEo5mNEug6nDRS:APA91bFcILyhugg2mk1-qBjzYCeC5YGUz8GfQrxvOF6BYhccrevUFTbo86bDl6NY75rE9RXhggMIVHzWtjK5RXsjLF7svy2uUnTLZbNi-KkEUKgHGydd8L-XEePFKejoiHIi_hXz3HEv','dnh3yo7xRb2Q2v2FVGj10F:APA91bFn6_p44bttoDBQaEooJI50lMUW71V-HD2PowmpqX4vdNFqehg78as8htBGBIHj0KkMRc8VhINPMyBR20X3PXhDBY88uiiMuXsggqZafTQz5qIdyo7_CbPR5haExd5p4T6PYrnh'];
            let subscriberNotification = notification.map(obj=>obj["notification_type"].localeCompare('subscription')===0?obj:'')
            let badgesNotification = notification.map(obj=>obj["notification_type"].localeCompare('badge_earned')===0?obj:'')
            let readNotification = notification.map(obj=>obj["notification_type"].localeCompare("read_story")===0?obj:'')
            if(subscriberNotification.length>0 && subscriberNotification[0].id){ // if subscriber notification is present

                let body={
                    title:'Subscription',
                    message:'Your Subscription will be renewed tomorrow',
                    notification_type:'badge_earned',
                    group:'0',
                    account_id:subscriberNotification[0].AccountId?subscriberNotification[0].AccountId.toString():'',
                    profile_id:subscriberNotification[0].UserProfileId?subscriberNotification[0].UserProfileId.toString():''
                };
                await updateNotification(subscriberNotification[0].id)
                await getDeviceTokensAndSendNotification(subscriberNotification[0].AccountId);
                // Helper.sendNotification(tokenArray,body)
            }else if(badgesNotification.length>0 && badgesNotification[0].id){ // subscriber notification not present but badges notification present
                let badges=badgesNotification.filter(e => e)
                let profile_ids=badges.map(obj=>obj['UserProfileId']);
                console.log(profile_ids)
                let badge_message=`${badge_notification_message} has earned badge`;
                // await updateGroupNotification(element.AccountId,'badge_earned')
                let body={
                    title:'Badge earned',
                    message:badge_message,
                    notification_type:'badge_earned',
                    group:'1',
                    account_id:badgesNotification[0].AccountId?badgesNotification[0].AccountId.toString():'',
                    profile_id:profile_ids.toString()
                };
                await getDeviceTokensAndSendNotification(badgesNotification[0].AccountId);
                // Helper.sendNotification(tokenArray,body)

            }else if(readNotification.length>0 && readNotification[0].id){ // subscriber and badges not present but read noti. present
                let read=readNotification.filter(e => e)
                let profile_ids=read.map(obj=>obj['UserProfileId']);
                console.log(profile_ids)
                let read_message=`${read_story_notification_message} has completed reading story`;
                await updateGroupNotification(element.AccountId,'read_story')
                let body={
                    title:'Story Read',
                    message:read_message,
                    notification_type:'badge_earned',
                    group:'1',
                    account_id:badgesNotification[0].AccountId?badgesNotification[0].AccountId.toString():'',
                    profile_id:profile_ids.toString()
                };
                await getDeviceTokensAndSendNotification(readNotification[0].AccountId);
                // Helper.sendNotification(tokenArray,body)
            }else{

            }
        }, null, true, 'Asia/Kolkata');
        job.start()
    }

}).catch(err=>console.log(err))

//notification once a week
cron.schedule('* * * * 7', () => {
    //will generate notification on every sunday
    console.log('running a task every sunday');

});
//notification once a month
// cron.schedule('* * * * * *', () => {
//     //will generate notification on 30 every month
//     Helper.subscribeNotification(["cpJhV3kmrEVwg87B9IOa8a:APA91bHRYhxZz7XBBmdYHa4m7Kt3h5W47nCHiQ16TtWNd1WtLFfEW84_zNDc_C9DKmME3jo_KZND1cVG_1Z_TcQm99-ExQb7riLxczGbpc7mY2dNOkR4dgWnrp7-c4eyCRfesQx4wLsD"],"news");
// });
//greeting notification
cron.schedule('0 0 1 1 *', () => {
    //will send notification to all on every new year!
    console.log('running a task every year on 1st jan');
});