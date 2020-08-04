
// let tokenData = (res, token) => {
//   let tokens = []
const moment = require('moment');
let FCM = require('fcm-node')

let serverKey = require('../../config/wisekids.json') //put the generated private key path here

let fcm = new FCM(serverKey)
var admin = require("firebase-admin");
var app = admin.initializeApp({
  credential: admin.credential.cert(serverKey),
});
class Helper {

  static sendNotification(device_token,body=null){
    for (const element of device_token){
      let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: element,
        notification: {
          title: body.title?body.title:'',
          body: body.message?body.message:''
        },

        data: {  //you can send only notification or only data(or include both)
          title: body.title?body.title:'',
          body: body.message?body.message:'',
          notification_type: body.notification_type?body.notification_type:'',
          group_notification:body.group?body.group:'0',
          account_id:body.account_id?body.account_id:'',
          profile_id:body.profile_id?body.profile_id:''
        }
      }

      fcm.send(message,(err,response)=>{
        if (err) {
          console.log(err)
          console.log("Something has gone wrong!")
        } else {
          console.log(response.results[0].error)
          console.log("Successfully sent with response: ", response)
        }
      })
    }
  }

  static subscribeNotification(device_token,topic_name,body=null){
    admin.messaging().subscribeToTopic(device_token,topic_name).then(user=>console.log(user)).catch(err=>console.log(err))
  }

  static unsubscribeNotification(device_token,topic_name,body=null){
    admin.messaging().unsubscribeFromTopic(device_token,topic_name).then(user=>console.log(user)).catch(err=>console.log(err))
  }
  static getMinutesAndSecondFromTimestamp(dbTimestamp, timestamp) {
    // let dbTime=moment(dbTimestamp)
    // let time=moment(timestamp)

    let dbTime = new Date(dbTimestamp * 1000)
    let time = new Date(timestamp * 1000)
    // Minutes From Timestamp
    var getMinutes = time.getMinutes();
    var minutes = dbTime.getMinutes() - getMinutes;
    // Seconds part from the timestamp    
    let formatted_time = "0" + minutes + ':' + '00';

    return formatted_time;

  }

  static upsert(Model, values, condition) {
    return Model.findOne({ where: condition })
      .then((obj) => {
        // update
        if (obj) {
          return obj.update(values)
        }
        // create
        return Model.create(values)
      })
  }
  static multisort(arr, columns, order_by) {
    if(typeof columns == 'undefined') {
      columns = []
      for(x=0;x<arr[0].length;x++) {
        columns.push(x);
      }
    }

    if(typeof order_by == 'undefined') {
      order_by = []
      for(x=0;x<arr[0].length;x++) {
        order_by.push('ASC');
      }
    }

    function multisort_recursive(a,b,columns,order_by,index) {
      var direction = order_by[index] == 'DESC' ? 1 : 0;

      var is_numeric = !isNaN(a[columns[index]]-b[columns[index]]);

      var x = is_numeric ? a[columns[index]] : a[columns[index]].toLowerCase();
      var y = is_numeric ? b[columns[index]] : b[columns[index]].toLowerCase();

      if(!is_numeric) {
        x = helper.string.to_ascii(a[columns[index]].toLowerCase(),-1),
        y = helper.string.to_ascii(b[columns[index]].toLowerCase(),-1);
      }

      if(x < y) {
        return direction == 0 ? -1 : 1;
      }

      if(x == y)  {
        return columns.length-1 > index ? multisort_recursive(a,b,columns,order_by,index+1) : 0;
      }

      return direction == 0 ? 1 : -1;
    }

    return arr.sort(function (a,b) {
      return multisort_recursive(a,b,columns,order_by,0);
    });
  }
}

module.exports = Helper