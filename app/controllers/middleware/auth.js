const jwt = require("jsonwebtoken")
const db = require('../../../models')
const Account = db.Account

const auth = async (req, res, next) => {
   try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, 'secretKey')
      const user = await Account.findOne({ where: { id: decoded.id, status: 1 } })
      if (!user) {
         res.status(404).json({ error: true, message: "invalid token." });
      }
      req.user = user
      next()
   } catch (e) {
      res.status(403).json({ error: true, message: e.message });
   }
}
module.exports = auth
