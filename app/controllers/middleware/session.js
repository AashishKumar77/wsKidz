const db = require('../../../models')
const UserDevice = db.UserDevice

const session = async (req, res, next) => {
    let path=req.route.path?req.route.path.substr(1):'';
    let token=req.headers.authorization.slice(7); // removing bearer from token
    let userToken = await UserDevice.findOne({where:{auth_token:token}})
    if(userToken && userToken.status==0){ // if user token is inactive
        res.status(401).json({statusCode:401,path,message:"Your session has been expired"})
    }else if(userToken && userToken.status==1){ // if user token is active
        next();
    }else{ // unable to find any token
        res.status(401).json({statusCode:401,path,message:"Your session has been expired"})
    }
}
module.exports = session
