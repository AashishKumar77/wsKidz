const { Validator } = require('node-input-validator')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const moment = require("moment")
const Helper = require('../helpers/Helper')

const db = require("../../models")
const { Op } = require('sequelize')
const Admin = db.Admin
const ValueTag = db.ValueTag
const CharacterTag = db.CharacterTag
const Charity = db.Charity
const Badge = db.Badge
const Story_category = db.Story_category
const TermConditions = db.TermConditions
const Faq = db.Faq
const FaqSection =db.FaqSection

// nodemailer transport
let smtpTransport = nodemailer.createTransport({
  // service: "gmail",
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_ENCRYPTION,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})
// admin login process
exports.login = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      email: 'required|email',
      password: 'required|minLength:6'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fileds are required.", validation_error: v.errors })
      return;
    } else {
      Admin.findOne({ where: { email: req.body.email, status: 1 } }).then(user => {
        if (!user) {
          res.status(404).json({
            error: true,
            message: 'You have entered an invalid email or password.'
          }); return;
        } else {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            let otp = 101010 //Math.floor(100000 + Math.random() * 900000)
            // let mailOptions = {
            //   to: user.email,
            //   subject: "Two-factor authentication",
            //   html: '<p>' + user.name + ', </p><p>This is your two-factor authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
            // }
            // smtpTransport.sendMail(mailOptions, (error, response) => {
            //   if (error) {
            //     res.status(400).json({ error: true, message: "Email server error.", err: error });
            //   } else {
            //     Admin.update({ otp: otp }, { where: { id: user.id, status: 1 } })
            //     res.status(200).json({ error: false, message: "Otp send your register email " + response.messageId, _id: user.id });
            //   }
            // })
            Admin.update({ otp: otp }, { where: { id: user.id, status: 1 } })
            res.status(200).json({ error: false, message: "Otp has been send your email", _id: user.id })
          } else {
            res.status(404).json({ error: true, message: "You have entered an invalid email or password." });
          }
        }
      })
        .catch(err => {
          res.status(500).send({ error: true, message: err.message })
        });
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// admin verify otp
exports.verifyOtp = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      user_id: 'required',
      otp: 'required|minLength:6'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fileds are required." })
      return;
    } else {
      const user = await Admin.findOne({
        attributes: ['id', 'otp', 'name', 'phone', 'image', 'email', 'createdAt', 'updatedAt'],
        where: {
          id: req.body.user_id, otp: req.body.otp,
          updatedAt: { [Op.gte]: moment().subtract(3, 'minute').toDate() }
        }
      })
      if (typeof user !== 'undefined' && user !== null) {
        let token = jwt.sign(user.dataValues, 'secretKey', { expiresIn: "8h" })
        await user.update({ otp: null })
        res.status(200).json({ error: false, message: "Login was successful.", user: user, token: token })
      } else {
        await Admin.update({ otp: null }, { where: { id: req.body.user_id } })
        res.status(500).json({ error: true, message: "Otp has been expired or wrong otp." })
      }
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// admin forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      email: 'required|email'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "Email is required." })
      return;
    } else {
      const admin = await Admin.findOne({
        attributes: ['id', 'email'], where: { email: req.body.email, status: 1 }
      })
      if (typeof admin !== 'undefined' && admin !== null) {
        let otp = 101010 //Math.floor(100000 + Math.random() * 900000)
        // let mailOptions = {
        //   to: user.email,
        //   subject: "Two-factor authentication",
        //   html: '<p>' + user.name + ', </p><p>This is your two-factor authentication code <b>' + otp + '</b>.</p><p>Thank You</p><p>Education!</p>'
        // }
        // smtpTransport.sendMail(mailOptions, (error, response) => {
        //   if (error) {
        //     res.status(400).json({ error: true, message: "Email server error.", err: error });
        //   } else {
        Admin.update({ otp: otp }, { where: { email: admin.email, status: 1 } })
        res.status(200).json({
          error: false,
          message: "Verification code send your register email address.",
          user_id: admin.id
        })
        //   }
        // })
      } else {
        res.status(500).json({ error: true, message: "This email is not registered on WiseKid." })
      }
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// reset forgot password
exports.resetForgotPassword = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      user_id: 'required',
      otp: 'required',
      password: 'required|minLength:6',
      confirm_password: 'required|minLength:6'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fields is required." })
      return;
    } else {
      const admin = await Admin.findOne({
        where: {
          id: req.body.user_id, otp: req.body.otp, status: 1,
          updatedAt: { [Op.gte]: moment().subtract(3, 'minute').toDate() }
        }
      })
      if (typeof admin !== 'undefined' && admin !== null) {
        if (req.body.password === req.body.confirm_password) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
              if (err) {
                res.status(500).json({ error: true, message: err })
              } else {
                await admin.update({ password: hash, otp: null })
                res.status(200).json({ error: false, message: "Password changed successfully." })
              }
            })
          })
        } else {
          res.status(401).json({ error: true, message: "New password and confirm password did not matched." })
        }
      } else {
        await Admin.update({ otp: null }, { where: { id: req.body.user_id } })
        res.status(500).json({ error: true, message: "Otp has been expired or wrong otp." })
      }
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// change password
exports.changePassword = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      old_password: 'required',
      new_password: 'required|minLength:6',
      confirm_password: 'required|minLength:6'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fields is required." })
      return;
    } else {
      const admin = await Admin.findOne({ where: { id: req.user.id, status: 1 } })
        .then(admin => {
          if (bcrypt.compareSync(req.body.old_password, admin.password)) {
            if (req.body.new_password === req.body.confirm_password) {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.new_password, salt, async (err, hash) => {
                  if (err) {
                    res.status(500).json({ error: true, message: err })
                  } else {
                    await admin.update({ password: hash })
                    res.status(200).json({ error: false, message: "Password changed successfully." })
                  }
                })
              })
            } else {
              res.status(500).json({ error: true, message: "New password and confirm password did not matched." })
            }
          } else {
            res.status(500).json({ error: true, message: 'Incorrect old password.' })
          }

        })
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// update profile
exports.updateProfile = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
          res.status(422).json({
            error: true,
            message: "Upload image file only gif, jpg and png."
          }); return false;
        }
        cb(null, 'public/profile');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        let mimetype = file.mimetype.replace('image/', '');
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).single('image');
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        name: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "Name field is required." })
        return;
      } else {
        var fileName = ''
        if (typeof req.file !== 'undefined') {
          fileName = process.env.API_URI + '/' + req.file.filename
        } else {
          fileName = req.body.image
        }
        if (typeof fileName === 'undefined' || fileName === 'null') {
          fileName = ''
        }
        Helper.upsert(Admin,
          { name: req.body.name, image: fileName },
          { id: req.user.id })
          .then((result) => {
            res.status(200).json({ error: false, message: "Profile updated successfully.", profile: result });
          })
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get profile
exports.getProfile = async (req, res) => {
  try {
    Admin.findOne({ where: { id: req.user.id, status: 1 }, attributes: ['id', 'name', 'email', 'image'] })
      .then(admin => {
        res.status(200).json({ error: false, message: "Profile get successfully.", profile: admin })
      })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// create and update value tags
exports.valuetagCreate = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
          res.status(422).json({
            error: true,
            message: "Upload image file only gif, jpg and png."
          }); return false;
        }
        cb(null, 'public/story');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        let mimetype = file.mimetype.replace('image/', '');
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).single('icon_url');
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        name: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "Value tag fields are required." })
        return;
      } else {
        if (typeof req.file !== 'undefined') {
          var fileName = process.env.API_URI + '/' + req.file.filename
        } else {
          var fileName = req.body.icon_url
        }
        if (fileName === undefined) {
          fileName = null
        }
        Helper.upsert(ValueTag,
          { name: req.body.name, keywords: req.body.keywords, color: req.body.color, icon_url: fileName },
          { id: req.body.tag_id })
          .then((result) => {
            res.status(200).json({ error: false, message: "Value tag created successfully.", tags: result });
          })
      }
    })

  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get value tags
exports.getValueTags = async (req, res) => {
  try {
    ValueTag.findAll({
      // where: { status: [1, 2] },
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'name', 'keywords', 'icon_url', 'color', 'status', 'createdAt'],
      order: [['id', 'DESC']]
    }).then((tags) => {
      res.status(200).json({ error: false, message: "Value tags get successfully.", tags: tags });
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive value tags
exports.activeInactiveValueTag = async (req, res) => {
  try {
    ValueTag.findOne({ where: { id: req.params.tag_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        let status = tags.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Value tag active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Value tag inactive successfully.'
        }
        await tags.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: tags });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// permanently delete value tags
exports.deleteValueTag = async (req, res) => {
  try {
    ValueTag.findOne({ where: { id: req.params.tag_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        await tags.update({ status: 0 })
        res.status(200).json({ error: false, message: "Value tags deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// create and update character tags
exports.charactertagCreate = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
          res.status(422).json({
            error: true,
            message: "Upload image file only gif, jpg and png."
          }); return false;
        }
        cb(null, 'public/story');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        let mimetype = file.mimetype.replace('image/', '');
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).single('icon_url');
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        name: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "Character tag fields are required." })
        return;
      } else {
        if (typeof req.file !== 'undefined') {
          var fileName = process.env.API_URI + '/' + req.file.filename
        } else {
          var fileName = req.body.icon_url
        }
        if (fileName === undefined) {
          fileName = null
        }
        Helper.upsert(CharacterTag,
          { name: req.body.name, icon_url: fileName },
          { id: req.body.tag_id })
          .then((result) => {
            res.status(200).json({ error: false, message: "Character tag created successfully.", tags: result });
          })
      }

    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get character tags
exports.getCharacterTags = async (req, res) => {
  try {
    CharacterTag.findAll({
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'name', 'icon_url', 'status', 'createdAt'],
      order: [['id', 'DESC']]
    }).then((tags) => {
      res.status(200).json({ error: false, message: "Character tags get successfully.", tags: tags });
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive character tags
exports.activeInactiveCharacterTag = async (req, res) => {
  try {
    CharacterTag.findOne({ where: { id: req.params.tag_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        let status = tags.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Character tag active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Character tag inactive successfully.'
        }
        await tags.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: tags });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// delete character tags
exports.deleteCharacterTag = async (req, res) => {
  try {
    CharacterTag.findOne({ where: { id: req.params.tag_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        await tags.update({ status: 0 })
        res.status(200).json({ error: false, message: "Character tag deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create and update charity
exports.charityCreate = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
          res.status(422).json({
            error: true,
            message: "Upload image file only gif, jpg and png."
          }); return false;
        }
        cb(null, 'public/story/charity');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        let mimetype = file.mimetype.replace('image/', '');
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).single('image');
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        name: 'required',
        short_description: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "All fields are required." })
        return;
      } else {
        if (typeof req.file !== 'undefined') {
          var fileName = process.env.API_URI + '/' + req.file.filename
        } else {
          var fileName = req.body.image
        }
        if (fileName === undefined) {
          fileName = null
        }
        Helper.upsert(Charity,
          {
            name: req.body.name, short_description: req.body.short_description,
            long_description: req.body.long_description, image: fileName
          },
          { id: req.body.charity_id })
          .then((result) => {
            res.status(200).json({ error: false, message: "Charity created successfully.", charity: result });
          })
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get charity
exports.getCharity = async (req, res) => {
  try {
    Charity.findAll({
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'name', 'short_description', 'long_description', 'image', 'status', 'createdAt'],
      order: [['id', 'DESC']]
    })
      .then((charity) => {
        res.status(200).json({ error: false, message: "Charity get successfully.", charities: charity });
      })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive charity tags
exports.activeInactiveCharityTag = async (req, res) => {
  try {
    Charity.findOne({ where: { id: req.params.tag_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        let status = tags.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Charity tag active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Charity tag inactive successfully.'
        }
        await tags.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: tags });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// delete charity
exports.deleteCharity = async (req, res) => {
  try {
    Charity.findOne({ where: { id: req.params.charity_id } }).then(async (charity) => {
      if (typeof charity !== 'undefined' && charity !== null) {
        await charity.update({ status: 0 })
        res.status(200).json({ error: false, message: "Charity deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create and update badges
exports.badgeCreate = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
          res.status(422).json({
            error: true,
            message: "Upload image file only gif, jpg and png."
          }); return false;
        }
        cb(null, 'public/story/badges');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        let mimetype = file.mimetype.replace('image/', '');
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).single('icon_url');
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        name: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "All fields are required." })
        return;
      } else {
        if (typeof req.file !== 'undefined') {
          var fileName = process.env.API_URI + '/' + req.file.filename
        } else {
          var fileName = req.body.icon_url
        }
        if (fileName === undefined) {
          fileName = null
        }
        Helper.upsert(Badge,
          {
            name: req.body.name, points: req.body.points, icon_url: fileName
          },
          { id: req.body.badge_id })
          .then((result) => {
            res.status(200).json({ error: false, message: "Badge created successfully.", badge: result });
          })
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get badges
exports.getBadge = async (req, res) => {
  try {
    Badge.findAll({
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'name', 'icon_url', 'points', 'status', 'createdAt'],
      order: [['id', 'DESC']]
    })
      .then((badge) => {
        res.status(200).json({ error: false, message: "Badges get successfully.", badges: badge });
      })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive charity tags
exports.activeInactiveBadge = async (req, res) => {
  try {
    Badge.findOne({ where: { id: req.params.badge_id } }).then(async (tags) => {
      if (typeof tags !== 'undefined' && tags !== null) {
        let status = tags.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Charity tag active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Charity tag inactive successfully.'
        }
        await tags.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: tags });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// delete badge
exports.deleteBadge = async (req, res) => {
  try {
    Badge.findOne({ where: { id: req.params.badge_id } }).then(async (badge) => {
      if (typeof badge !== 'undefined' && badge !== null) {
        await badge.update({ status: 0 })
        res.status(200).json({ error: false, message: "Badge deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create update story category
exports.storyCategoryCreate = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      name: 'required'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "Name fields is required." })
      return;
    } else {
      Helper.upsert(Story_category,
        {
          name: req.body.name
        },
        { id: req.body.category_id })
        .then((result) => {
          res.status(200).json({ error: false, message: "Story category created successfully.", category: result });
        })
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get story category
exports.getStoryCategory = async (req, res) => {
  try {
    Story_category.findAll({
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'name', 'status', 'createdAt'],
      order: [['id', 'DESC']]
    })
      .then((category) => {
        res.status(200).json({ error: false, message: "Story category get successfully.", categories: category });
      })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive story category
exports.activeInactiveStoryCategory = async (req, res) => {
  try {
    Story_category.findOne({ where: { id: req.params.category_id } }).then(async (category) => {
      if (typeof category !== 'undefined' && category !== null) {
        let status = category.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Story category active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Story category inactive successfully.'
        }
        await category.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: category });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// delete story category
exports.deleteStoryCategory = async (req, res) => {
  try {
    Story_category.findOne({ where: { id: req.params.category_id } }).then(async (category) => {
      if (typeof category !== 'undefined' && category !== null) {
        await category.update({ status: 0 })
        res.status(200).json({ error: false, message: "Category deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// create termsOfUse
exports.createTermsOfUse = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      version: 'required',
      term_conditions: 'required'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fields are required." })
      return;
    } else {
      TermConditions.create({ version: req.body.version, term_conditions: req.body.term_conditions })
        .then((terms) => {
          res.status(200).json({ error: false, message: "Terms of use created successfully." })
        })
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get termsOfUse
exports.getTermsOfUse = async (req, res) => {
  try {
    TermConditions.findAll({ where: { status: 1 }, order: [['id', 'DESC']] }).then((terms) => {
      res.status(200).json({ error: false, message: "Get terms of use successfully.", terms: terms })
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// delete termsOfUse
exports.deleteTermsOfUse = async (req, res) => {
  try {
    TermConditions.findOne({ where: { id: req.params.term_id, status: 1 } }).then((term) => {
      if (typeof term !== 'undefined' && term !== null) {
        term.update({ status: 0 })
        res.status(200).json({ error: false, message: "Term deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create faq
exports.createFaq = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      faq_questions: 'required',
      faq_answers: 'required'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fields are required." })
      return;
    } else {
      Helper.upsert(Faq,
        { faq_questions: req.body.faq_questions, faq_answers: req.body.faq_answers },
        { id: req.body.faq_id })
        .then((faq) => {
          res.status(200).json({ error: false, message: "FAQ created successfully.", faq: faq });
        })
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get all faq
exports.getAllFaq = async (req, res) => {
  try {
    Faq.findAll({ order: [['id', 'DESC']] }).then((faq) => {
      res.status(200).json({ error: false, message: "FAQ get successfully.", faq: faq })
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

//get all getAllFaqSection

exports.getAllFaqSection = async(req,res) => { 
  try {
    FaqSection.findAll({ order: [['id', 'DESC']] }).then((faq) => {
      console.log()
      res.status(200).json({ error: false, message: "FAQ get successfully.", faq: faq })
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get faq using faq_id
exports.getFaq = async (req, res) => {
  try {
    Faq.findOne({ where: { id: req.params.faq_id }, order: [['id', 'DESC']] }).then((faq) => {
      if (typeof faq !== 'undefined' && faq !== null) {
        res.status(200).json({ error: false, message: "FAQ get successfully.", faq: faq })
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}