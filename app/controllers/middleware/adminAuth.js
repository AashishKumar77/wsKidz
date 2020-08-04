const jwt = require("jsonwebtoken")
const db = require('../../../models')
const Admin = db.Admin

const adminAuth = async (req, res, next) => {
   try {
      let token = req.header('Authorization').split(" ", 2)
      if (token[0] === 'Bearer') {
         // const token = req.header('Authorization').replace('Bearer ', '')
         const decoded = jwt.verify(token[1], 'secretKey')
         const user = await Admin.findOne({ where: { id: decoded.id, status: 1 } })
         if (!user) {
            res.status(403).json({ error: true, message: "invalid token." });
         }
         req.user = user
         next()
      } else {
         res.status(404).json({ error: true, message: "Bearer your_token." });
      }
   } catch (e) {
      res.status(403).json({ error: true, message: e.message });
   }
}
module.exports = adminAuth
