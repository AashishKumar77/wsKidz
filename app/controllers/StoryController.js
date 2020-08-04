const { Validator } = require('node-input-validator')
const multer = require('multer')
const Helper = require('../helpers/Helper')

const db = require("../../models")
const { Op } = require('sequelize')
const Story = db.Story
const StoryImages=db.StoryImages
const ValueTag = db.ValueTag
const CharacterTag = db.CharacterTag
const StoryValueTag = db.StoryValueTag
const StoryCharacterTag = db.StoryCharacterTag
const Story_category = db.Story_category
const StoryPages = db.StoryPages
const StoryQuestions = db.StoryQuestions
const StoryQuestionsAnswer = db.StoryQuestionsAnswer

// get value tags for create story (multiselect dropdown)
exports.getValueTags = async (req, res) => {
  try {
    ValueTag.findAll({
      where: { status: 1 },
      attributes: ['id', 'name'],
      order: [['id', 'DESC']]
    }).then((tags) => {
      res.status(200).json({ error: false, message: "Value tags get successfully.", tags: tags });
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get character tags for create story (multiselect dropdown)
exports.getCharacterTags = async (req, res) => {
  try {
    CharacterTag.findAll({
      where: { status: 1 },
      attributes: ['id', 'name'],
      order: [['id', 'DESC']]
    }).then((tags) => {
      res.status(200).json({ error: false, message: "Character tags get successfully.", tags: tags });
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get story category for create story (category dropdown)
exports.getCategory = async (req, res) => {
  try {
    Story_category.findAll({
      where: { status: 1 },
      attributes: ['id', 'name'],
      order: [['id', 'DESC']]
    })
      .then((category) => {
        res.status(200).json({ error: false, message: "Story category get successfully.", categories: category });
      })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create story
exports.createStory = async (req, res) => {
  try {

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'video/mp4' && file.mimetype !== 'audio/mpeg') {
          res.status(422).json({
            error: true,
            message: "Upload file only gif, jpg, png, mp4 and mp3."
          }); return false;
        }
        cb(null, 'public/story/createStory');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        var mimetype = ''
        if (file.mimetype === 'video/mp4') {
          mimetype = file.mimetype.replace('video/', '')
        } else if (file.mimetype === 'audio/mpeg') {
          mimetype = file.mimetype.replace('audio/', '');
        } else {
          mimetype = file.mimetype.replace('image/', '');
        }
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).fields([{
      name: 'video_url', maxCount: 1
    }, {
      name: 'synopsis_image', maxCount: 1
    },{
      name: 'ipad_image', maxCount: 1
    }, {
      name: 'catalogue_image', maxCount: 1
    },{
      name: 'tablet_image', maxCount: 1
    }, {
      name: 'synopsis_audio_url', maxCount: 1
    }])
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        title: 'required',
        points: 'required|integer',
        button_color: 'required',
        synopsis_content: 'required'
      })
      const matched = await v.check()
      // if (!matched) {
      //   res.status(422).json({ error: true, message: "All fields is required.", validation_error: v.errors })
      //   return;
      // } else {
        if (typeof req.files !== 'undefined') {
          if (typeof req.files.video_url !== 'undefined') {
            var video_url =  process.env.API_URI  + '/' + req.files.video_url[0].filename
          } else {
            var video_url = req.body.video_url
          }
          if (typeof req.files.synopsis_audio_url !== 'undefined') {
            var synopsis_audio_url =  process.env.API_URI  + '/' + req.files.synopsis_audio_url[0].filename
          } else {
            var synopsis_audio_url = req.body.synopsis_audio_url
          }
          if (typeof req.files.synopsis_image !== 'undefined') {
            var synopsis_image =  process.env.API_URI  + '/' + req.files.synopsis_image[0].filename
          } else {
            var synopsis_image = req.body.synopsis_image
          }
          if (typeof req.files.ipad_image !== 'undefined') {
            var synopsis_image_ipad =  process.env.API_URI  + '/' + req.files.ipad_image[0].filename
          } else {
            var synopsis_image_ipad = req.body.ipad_image
          }
          if (typeof req.files.catalogue_image !== 'undefined') {
            var catalogue_image = process.env.API_URI + '/' + req.files.catalogue_image[0].filename
          } else {
            var catalogue_image = req.body.catalogue_image
          }
          if (typeof req.files.tablet_image !== 'undefined') {
            var catalogue_image_tablet =  process.env.API_URI  + '/' + req.files.tablet_image[0].filename
          } else {
            var catalogue_image_tablet = req.body.tablet_image
          }
        }
        if (video_url === undefined) {
          video_url = null
        }
        if (synopsis_audio_url === undefined) {
          synopsis_audio_url = null
        }
        if (synopsis_image === undefined) {
          synopsis_image = null
        }
        if (synopsis_image_ipad === undefined) {
          synopsis_image_ipad = null
        }
        if (catalogue_image === undefined) {
          catalogue_image = null
        }
        if (catalogue_image_tablet === undefined) {
          catalogue_image_tablet = null
        }
        console.log(catalogue_image_tablet,"catalogue_image_tablet",synopsis_image_ipad)
        Story.create({
          AdminId: req.user.id,
          StoryCategoryId: req.body.StoryCategoryId,
          title: req.body.title,
          video_url: video_url,
          ipad_image:synopsis_image_ipad,
          tablet_image:catalogue_image_tablet,
          synopsis_audio_url: synopsis_audio_url,
          catalogue_image: catalogue_image,
          audio_flag: req.body.audio_flag,
          search_keywords: req.body.search_keywords,
          button_color: req.body.button_color,
          points: req.body.points,
          synopsis_content: req.body.synopsis_content,
          synopsis_image: synopsis_image,
          locked: req.body.locked
        }).then((story) => {
          let ValueTagId = req.body.ValueTagId // [1, 2, 3]
          let CharacterTagId = req.body.CharacterTagId // [1, 2, 3]
          if (typeof ValueTagId !== 'undefined' && ValueTagId !== null) {
            var str = ValueTagId
            var strrep = str.replace(/\,/g, " ")
            let arr = strrep.split(" ")
            arr = arr.filter((strFilter) => { return /\S/.test(strFilter) })
            arr.forEach(async id => {
              await StoryValueTag.create({ StoryId: story.id, ValueTagId: id })
            })
          }
          if (typeof CharacterTagId !== 'undefined' && CharacterTagId !== null) {
            var str1 = CharacterTagId
            var strrep1 = str1.replace(/\,/g, " ")
            let arr1 = strrep1.split(" ")
            arr1 = arr1.filter((strFilter) => { return /\S/.test(strFilter) })
            arr1.forEach(async id => {
              // console.log(id)
              await StoryCharacterTag.create({ StoryId: story.id, CharacterTagId: id })
            })
          }
          setTimeout(async () => {
            const storyData = await Story.findOne({
              where: { id: story.id, status: 1 },
              attributes: ['id', 'title', 'video_url', 'synopsis_audio_url', 'catalogue_image', 'synopsis_image', 'points', 'status', 'audio_flag', 'locked', 'button_color', 'synopsis_content', 'StoryCategoryId', 'search_keywords'],
              include: [
                { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
                { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
              ]
            })
            res.status(200).json({ error: false, message: "Story created successfully.", story: storyData })
          }, 500)
        })
      // }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// update story
exports.updateStory = async (req, res) => {
  try {
    
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'video/mp4' && file.mimetype !== 'audio/mpeg') {
          res.status(422).json({
            error: true,
            message: "Upload file only gif, jpg, png, mp4 and mp3."
          }); return false;
        }
        cb(null, 'public/story/createStory');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        var mimetype = ''
        if (file.mimetype === 'video/mp4') {
          mimetype = file.mimetype.replace('video/', '')
        } else if (file.mimetype === 'audio/mpeg') {
          mimetype = file.mimetype.replace('audio/', '');
        } else {
          mimetype = file.mimetype.replace('image/', '');
        }
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).fields([{
      name: 'video_url', maxCount: 1
    }, {
      name: 'synopsis_image', maxCount: 1
    } ,{
      name: 'ipad_image', maxCount: 1
    }, {
      name: 'synopsis_audio_url', maxCount: 1
    }, {
      name: 'catalogue_image', maxCount: 1
    },{
      name: 'tablet_image', maxCount: 1
    }])
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        title: 'required',
        points: 'required|integer',
        button_color: 'required',
        synopsis_content: 'required'
      })
      const matched = await v.check()
      // if (!matched) {
      //   res.status(422).json({ error: true, message: "All fields is required.", validation_error: v.errors })
      //   return;
      // } else {
        if (typeof req.files !== 'undefined') {
          if (typeof req.files.video_url !== 'undefined') {
            var video_url =  process.env.API_URI  + '/' + req.files.video_url[0].filename
          } else {
            var video_url = req.body.video_url
          }
          if (typeof req.files.synopsis_audio_url !== 'undefined') {
            var synopsis_audio_url =  process.env.API_URI + '/' + req.files.synopsis_audio_url[0].filename
          } else {
            var synopsis_audio_url = req.body.synopsis_audio_url
          }
          if (typeof req.files.synopsis_image !== 'undefined') {
            var synopsis_image =  process.env.API_URI  + '/' + req.files.synopsis_image[0].filename
          } else {
            var synopsis_image = req.body.synopsis_image
          }
          if (typeof req.files.ipad_image !== 'undefined') {
            var ipad_image =  process.env.API_URI + '/' + req.files.ipad_image[0].filename
          } else {
            var ipad_image = req.body.ipad_image
          }
          if (typeof req.files.catalogue_image !== 'undefined') {
            var catalogue_image =  process.env.API_URI + '/' + req.files.catalogue_image[0].filename
          } else {
            var catalogue_image = req.body.catalogue_image
          }
          console.log(req.files.tablet_image,"req.files.tablet_image")
          if (typeof req.files.tablet_image !== 'undefined') {
            var tablet_image =  process.env.API_URI + '/' + req.files.tablet_image[0].filename
          } else {
            var tablet_image = req.body.tablet_image
          }
        }
        if (video_url === undefined) {
          video_url = null
        }
        if (synopsis_audio_url === undefined) {
          synopsis_audio_url = null
        }
        if (synopsis_image === undefined) {
          synopsis_image = null
        }
        if (ipad_image === undefined) {
          ipad_image = null
        }
        if (catalogue_image === undefined) {
          catalogue_image = null
        }
        if (tablet_image === undefined) {
          tablet_image = null
        }
        const story = await Story.update({
          StoryCategoryId: req.body.StoryCategoryId,
          title: req.body.title,
          video_url: video_url,
          synopsis_audio_url: synopsis_audio_url,
          audio_flag: req.body.audio_flag,
          search_keywords: req.body.search_keywords,
          button_color: req.body.button_color,
          points: req.body.points,
          ipad_image:ipad_image,
          tablet_image:tablet_image,
          catalogue_image: catalogue_image,
          synopsis_content: req.body.synopsis_content,
          synopsis_image: synopsis_image,
          locked: req.body.locked
        }, { where: { id: req.body.story_id, AdminId: req.user.id, status: 1 } })

        let ValueTagId = req.body.ValueTagId // [1, 2, 3]
        let CharacterTagId = req.body.CharacterTagId // [1, 2, 3]
        if (typeof ValueTagId !== 'undefined' && ValueTagId !== null) {
          //string to array, remove comma and remove space in member_id
          var str = ValueTagId;
          var strrep = str.replace(/\,/g, " ");
          let arr = strrep.split(" ")
          arr = arr.filter(function (strFilter) {
            return /\S/.test(strFilter);
          })
          // get old StoryValueTag
          const valueId = await StoryValueTag.findAll({ attributes: ['id', 'ValueTagId'], where: { StoryId: req.body.story_id, status: 1 } })
          var newMember = [];
          for (var i = 0; i < valueId.length; i++) {
            newMember.push(valueId[i]['ValueTagId'].toString())
          }
          arr.forEach(async id => {
            id = id.toString()
            var removeDuplicate1 = newMember.indexOf(id)
            if (removeDuplicate1 >= 0) {
              // console.log(id, ' No action');
            } else {
              // console.log(id, ' new create');
              await StoryValueTag.create({ StoryId: req.body.story_id, ValueTagId: id })
            }
          })
          valueId.forEach(async (ids) => {
            var removeDuplicate = arr.includes(ids.ValueTagId.toString())
            if (removeDuplicate === true) {
              // console.log(ids.ValueTagId, ' if no action');
            } else if (removeDuplicate === false) {
              // console.log(ids.ValueTagId, ' delete')
              await StoryValueTag.destroy({ where: { StoryId: req.body.story_id, ValueTagId: ids.ValueTagId } })
            }
          })
        }
        // get old StoryCharacterTag
        if (typeof CharacterTagId !== 'undefined' && CharacterTagId !== null) {
          var str1 = CharacterTagId;
          var strrep1 = str1.replace(/\,/g, " ");
          let arr1 = strrep1.split(" ")
          arr1 = arr1.filter(function (strFilter1) {
            return /\S/.test(strFilter1);
          })
          const characterId = await StoryCharacterTag.findAll({ attributes: ['id', 'CharacterTagId'], where: { StoryId: req.body.story_id, status: 1 } })
          var newMember1 = [];
          for (var i = 0; i < characterId.length; i++) {
            newMember1.push(characterId[i]['CharacterTagId'].toString())
          }
          arr1.forEach(async id => {
            id = id.toString()
            var removeDuplicate2 = newMember1.indexOf(id)
            if (removeDuplicate2 >= 0) {
              // console.log(id, ' No action1');
            } else {
              // console.log(id, ' action1');
              await StoryCharacterTag.create({ StoryId: req.body.story_id, CharacterTagId: id })
            }
          })
          characterId.forEach(async (ids) => {
            var removeDuplicate3 = arr1.includes(ids.CharacterTagId.toString())
            if (removeDuplicate3 === true) {
              // console.log(ids.CharacterTagId, ' if1');
            } else if (removeDuplicate3 === false) {
              // console.log(ids.CharacterTagId, ' else1')
              await StoryCharacterTag.destroy({ where: { StoryId: req.body.story_id, CharacterTagId: ids.CharacterTagId } })
            }
          })
        }
        setTimeout(async () => {
          const storyData = await Story.findOne({
            where: { id: req.body.story_id, status: 1 },
            attributes: ['id', 'title', 'video_url', 'synopsis_image', 'synopsis_audio_url', 'catalogue_image', 'points', 'status', 'audio_flag', 'locked', 'button_color', 'synopsis_content', 'StoryCategoryId', 'search_keywords','ipad_image','tablet_image'],
            include: [
              { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
              { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
            ]
          })
          res.status(200).json({ error: false, message: "Story updated successfully.", story: storyData })
        }, 1000)
      // }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get story
exports.getStory = async (req, res) => {

  try {
    Story.findAll({
      where: { status: { [Op.ne]: 0 } },
      attributes: ['id', 'title', 'video_url', 'synopsis_image', 'synopsis_audio_url', 'catalogue_image', 'points', 'status','ipad_image','tablet_image',
        'audio_flag', 'locked', 'button_color', 'synopsis_content', 'StoryCategoryId', 'search_keywords'],
      include: [
        { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
        { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
      ],
      order: [['id', 'DESC']]
    })
      .then(async (story) => {

        res.status(200).json({ error: false, message: "Story get successfully.", stories: story });
      })
  } catch (e) {

    res.status(400).json({ error: true, message: e.message })
  }
}
// active inactive story
exports.activeInactiveStory = async (req, res) => {
  try {
    Story.findOne({
      where: { id: req.params.story_id },
      include: [
        { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
        { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
      ]
    }).then(async (story) => {
      if (typeof story !== 'undefined' && story !== null) {
        let status = story.status
        let msg = ''
        if (status === 2) {
          status = 1
          msg = 'Story active successfully.'
        } else if (status === 1) {
          status = 2
          msg = 'Story inactive successfully.'
        }
        await story.update({ status: status })
        res.status(200).json({ error: false, message: msg, status: story });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// delete story
exports.deleteStory = async (req, res) => {
  try {
    Story.findOne({ where: { id: req.params.story_id } }).then(async (story) => {
      if (typeof story !== 'undefined' && story !== null) {
        await story.update({ status: 0 })
        res.status(200).json({ error: false, message: "Story deleted successfully." });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
exports.deleteStoryId = async (req,res) =>{
  try {
    StoryImages.destroy({ where: { id: req.params.id } }).then(async (story)=>{
      console.log(story,"story")
      // StoryImages.findAll({ where: { id: req.params.id }}).then(async (story)=>{
      res.status(400).json({ error: true, message: "done",audio:[] })
    });
  } catch(e) {
    res.status(400).json({ error: true, message: e.message })

  }
}


// story audio flag on off
exports.onOffAudioFlag = async (req, res) => {
  try {
    Story.findOne({
      where: { id: req.params.story_id },
      include: [
        { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
        { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
      ]
    }).then(async (story) => {
      if (typeof story !== 'undefined' && story !== null) {
        let audio_flag = story.audio_flag
        let msg = ''
        if (audio_flag === false) {
          audio_flag = true
          msg = 'Audio flag active successfully.'
        } else if (audio_flag === true) {
          audio_flag = false
          msg = 'Audio flag inactive successfully.'
        }
        await story.update({ audio_flag: audio_flag })
        res.status(200).json({ error: false, message: msg, audio_flag: story });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// story locked on off
exports.onOffLocked = async (req, res) => {
  try {
    Story.findOne({
      where: { id: req.params.story_id },
      include: [
        { model: StoryValueTag, attributes: ['id'], include: { model: ValueTag, attributes: ['id', 'name'] } },
        { model: StoryCharacterTag, attributes: ['id'], include: { model: CharacterTag, attributes: ['id', 'name'] } }
      ]
    }).then(async (story) => {
      if (typeof story !== 'undefined' && story !== null) {
        let locked = story.locked
        let msg = ''
        if (locked === false) {
          locked = true
          msg = 'Locked active successfully.'
        } else if (locked === true) {
          locked = false
          msg = 'Locked inactive successfully.'
        }
        await story.update({ locked: locked })
        res.status(200).json({ error: false, message: msg, locked: story });
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get value tag keywords
exports.autoSearchKeywords = async (req, res) => {
  try {
    const valueTag = await ValueTag.findOne({ attributes: ['id', 'keywords'], where: { id: req.params.valuetag_id, status: 1 } })
    if (typeof valueTag !== 'undefined' && valueTag !== null) {
      res.status(200).json({ error: false, message: "Value tag keyword get successfully.", keywords: valueTag });
    } else {
      res.status(500).json({ error: true, message: "Something went wrong." });
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get all story pages
exports.getAllStoryPage = async (req, res) => {
  try {
    console.log(req.params.story_id,"req.params.story_id")
    const story = await Story.findOne({ where: { id: req.params.story_id, status: 1 } })
    if (typeof story !== 'undefined' && story !== null) {
      StoryPages.findAll({ where: { StoryId: story.id }, order: [['id', 'DESC']] }).then((storypage) => {
        res.status(200).json({ error: false, message: "Story pages get successfully.", storypages: storypage })
      })
    } else {
      res.status(500).json({ error: true, message: "Something went wrong." });
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
exports.getAllStoryPageImages = async(req, res) =>{
  try {
   
    StoryImages.findAll({ where: { StoryId: req.params.story_id }, order: [['id', 'DESC']] }).then((storypage) => {
      console.log(storypage,"storypage")
        res.status(200).json({ error: false, message: "Story pages get successfully.", storypages: storypage })
      })
    
  
  } catch (e){

  }
}
// update story page createStoryPage
exports.updateStoryPage = async (req, res) => {
  
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'audio/mpeg') {
          res.status(422).json({
            error: true,
            message: "Upload file only gif, jpg, png and mp3."
          }); return false;
        }
        cb(null, 'public/story/pages');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        var mimetype = ''
        if (file.mimetype === 'audio/mpeg') {
          mimetype = file.mimetype.replace('audio/', '');
        } else {
          mimetype = file.mimetype.replace('image/', '');
        }
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).fields([{
      name: 'page_image', maxCount: 1
    }, {
      name: 'audio_url', maxCount: 1
    }])
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        StoryId: 'required',
        page_content: 'required'
      })
      const matched = await v.check()
      if (!matched) {
        res.status(422).json({ error: true, message: "All fields are required." })
        return;
      } else {
        const story = await Story.findOne({ where: { id: req.body.StoryId, status: 1 } })
        if (typeof story !== 'undefined' && story !== null) {
          if (typeof req.files !== 'undefined') {
            if (typeof req.files.page_image !== 'undefined') {
              var page_image = process.env.API_URI + '/' + req.files.page_image[0].filename
            } else {
              var page_image = req.body.page_image
            }
            if (typeof req.files.audio_url !== 'undefined') {
              var audio_url = process.env.API_URI + '/' + req.files.audio_url[0].filename
            } else {
              var audio_url = req.body.audio_url
            }
          }
          if (page_image === undefined) {
            page_image = null
          }
          if (audio_url === undefined) {
            audio_url = null
          }
          StoryPages.create({
            page_content: req.body.page_content,
            page_number: req.body.page_number,
            page_image: page_image,
            audio_url: audio_url,
            StoryId: story.id
          }).then(storypage => {
            res.status(200).json({ error: false, message: "Story page created successfully.", storypage: storypage });
          })
        } else {
          res.status(500).json({ error: true, message: "Something went wrong." });
        }
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

exports.createStoryPageImages = async(req,res) =>{
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'audio/mpeg') {
          res.status(422).json({
            error: true,
            message: "Upload file only gif, jpg, png and mp3."
          }); return false;
        }
        cb(null, 'public/story/pages');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        var mimetype = ''
        if (file.mimetype === 'audio/mpeg') {
          mimetype = file.mimetype.replace('audio/', '');
        } else {
          mimetype = file.mimetype.replace('image/', '');
        }
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).fields([ {
      name: 'images1', maxCount: 1
    }, {
      name: 'images2', maxCount: 1
    }])
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        StoryId: 'required'
      })
      const matched = await v.check()
      // if (!matched) {
      //   res.status(422).json({ error: true, message: "All fields are required." })
      //   return;
      // } else {
        
        const storyPage = await Story.findOne({ where: { id: req.body.StoryId } }).catch(err=>console.log(err,"------err"))
        // console.log(storyPage,"storyPage")
        if (typeof storyPage !== 'undefined' && storyPage !== null) {
          // if (typeof req.files !== 'undefined') {
            if (typeof req.files.images1 !== 'undefined') {
              var images1 = process.env.API_URI + '/' + req.files.images1[0].filename
            } else {
              var images1 = req.files.images1
            }
            if (typeof req.files.images2 !== 'undefined') {
              var images2 = process.env.API_URI + '/' + req.files.images2[0].filename
            } else {
              var images2 = req.files.images2
            }      
        // }
          if (images1 === undefined) {
            images1 = null
          }
          if (images2 === undefined) {
            images2 = null
          }  

        // ** async await issue on here ==========
        await  StoryImages.create({'count':req.body.charCount,'image':images1,'ipad_image':images2,'tablet_image':images2,'StoryId':req.body.StoryId})
           
        await  StoryImages.findAll({ where: { StoryId: req.body.StoryId } , order: [['id', 'DESC']] }).then(async (storypage) => {
           
             await res.status(200).json({ error: false, message: "Story pages get successfully.", storypages: storypage })
            
          })
        


          
        } else {
          console.log('hiii')
          res.status(500).json({ error: true, message: "Something went wrong." });
        }
      // }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}


// create story page
exports.createStoryPage= async (req, res) => {
  
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'audio/mpeg') {
          res.status(422).json({
            error: true,
            message: "Upload file only gif, jpg, png and mp3."
          }); return false;
        }
        cb(null, 'public/story/pages');
      },
      filename: function (req, file, cb) {
        let random = Math.random().toString(36).substring(2);
        var mimetype = ''
        if (file.mimetype === 'audio/mpeg') {
          mimetype = file.mimetype.replace('audio/', '');
        } else {
          mimetype = file.mimetype.replace('image/', '');
        }
        cb(null, random + '_' + new Date().getTime() + '.' + mimetype);
      },
    });
    const upload = multer({ storage: storage }, { limits: { fileSize: 1000000 } }).fields([{
      name: 'page_image', maxCount: 1
    }, {
      name: 'audio_url', maxCount: 1
    }])
    upload(req, res, async () => {
      const v = new Validator(req.body, {
        StoryId: 'required',
        // page_id: 'required',
        page_content: 'required'
      })
      const matched = await v.check()
      // if (!matched) {
      //   res.status(422).json({ error: true, message: "All fields are required." })
      //   return;
      // } else {
        
        const storyPage = await Story.findOne({ where: { id: req.body.StoryId } }).catch(err=>console.log(err,"------err"))
        // console.log(storyPage,"storyPage")
        if (typeof storyPage !== 'undefined' && storyPage !== null) {
          if (typeof req.files !== 'undefined') {
            if (typeof req.files.page_image !== 'undefined') {
              var page_image = process.env.API_URI + '/' + req.files.page_image[0].filename
            } else {
              var page_image = req.body.page_image
            }
            if (typeof req.files.audio_url !== 'undefined') {
              var audio_url = process.env.API_URI + '/' + req.files.audio_url[0].filename
            } else {
              var audio_url = req.body.audio_url
            }
        }
          console.log(req.body,"========",audio_url)
          
          //===============working on this======
          if (page_image === undefined) {
            page_image = null
          }
          if (audio_url === undefined) {
            audio_url = null
          }
          Story.update({'text':req.body.page_content,'story_audio_url':audio_url},{where:{id:req.body.StoryId}}).then((storypage) => {
            console.log(storypage,"storypage")
          res.status(200).json({ error: false, message: "Data update" ,storypage:[]});
          // StoryImages.create({'count':req.body.charCount,'image':images1,'ipad_image':images2,'tablet_image':images2,'StoryId':req.body.StoryId}).catch(err=>console.log(err))
          });
        } else {
          console.log('hiii')
          res.status(500).json({ error: true, message: "Something went wrong." });
        }
      // }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// get story page using page_id
exports.getStoryPage = async (req, res) => {
  try {
    StoryPages.findOne({ where: { id: req.params.page_id }, order: [['id', 'DESC']] }).then((storypage) => {
      if (typeof storypage !== 'undefined' && storypage !== null) {
        res.status(200).json({ error: false, message: "Story page get successfully.", storypage: storypage })
      } else {
        res.status(500).json({ error: true, message: "Something went wrong." });
      }
    })
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}

// create and update story QA
exports.createUpdateStoryQA = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      storyQuestionsId: 'required|integer',
      StoryId: 'required|integer',
      question_type: 'required|integer|between:1,3',
      question_text: 'required'
    })
    const matched = await v.check()
    if (!matched) {
      res.status(422).json({ error: true, message: "All fields is required.", validation_error: v.errors })
      return;
    } else {
      // delete data if user change Q type
      if (req.body.storyQuestionsId !== 0) {
        let deleteData = await StoryQuestions.findOne({ where: { id: req.body.storyQuestionsId, status: 1 } })
        if (deleteData.question_type === 1) {
          if (deleteData.question_type !== req.body.question_type) {
            await StoryQuestionsAnswer.destroy({ where: { StoryQuestionId: deleteData.id } })
          }
        }
      }
      // createOrUpdate and StoryQuestions table
      Helper.upsert(StoryQuestions,
        {
          StoryId: req.body.StoryId,
          question_type: req.body.question_type,
          question_text: req.body.question_text
        },
        { id: req.body.storyQuestionsId })
        .then(async (result) => {
          if (req.body.question_type === 1) {
            if (req.body.answers.length > 0) {
              req.body.answers.forEach(async data => {
                // createOrUpdate and StoryQuestionsAnswer table
                Helper.upsert(StoryQuestionsAnswer,
                  {
                    StoryQuestionId: result.id,
                    answer_text: data.answer_text,
                    answer_status: 1
                  },
                  { id: data.answerId })
              })
            }
          }
          setTimeout(async () => {
            const storyQuestion = await StoryQuestions.findOne({
              where: { id: result.id, status: 1 },
              order: [['id', 'DESC']],
              include: [
                {
                  model: StoryQuestionsAnswer, as: "answers",
                  where: { status: 1 },
                  required: false, attributes: ['id', 'answer_text']
                }
              ]
            })
            res.status(200).json({ error: false, message: "Story question answer created successfully.", storyQuestion: storyQuestion });
          }, 300)
        })
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get all story question
exports.getAllStoryQuestion = async (req, res) => {
  try {
    const story = await Story.findOne({ where: { id: req.params.story_id, status: 1 } })
    if (typeof story !== 'undefined' && story !== null) {
      StoryQuestions.findAll({
        where: { StoryId: story.id },
        order: [['id', 'DESC']],
        include: [
          {
            model: StoryQuestionsAnswer, as: "answers",
            where: { status: 1 },
            required: false, attributes: ['id', 'answer_text']
          }
        ]
      }).then((result) => {
        res.status(200).json({ error: false, message: "Story question successfully.", storyQuestions: result })
      })
    } else {
      res.status(500).json({ error: true, message: "Something went wrong." });
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}
// get story page using storyQuestionsId
exports.getStoryQuestion = async (req, res) => {
  try {
    const storyQuestion = await StoryQuestions.findOne({
      where: { id: req.params.storyQuestionsId, status: 1 },
      order: [['id', 'DESC']],
      include: [
        {
          model: StoryQuestionsAnswer, as: "answers",
          where: { status: 1 },
          required: false, attributes: ['id', 'answer_text']
        }
      ]
    })
    if (typeof storyQuestion !== 'undefined' && storyQuestion !== null) {
      res.status(200).json({ error: false, message: "Story question get successfully.", storyQuestion: storyQuestion })
    } else {
      res.status(500).json({ error: true, message: "Something went wrong." });
    }
  } catch (e) {
    res.status(400).json({ error: true, message: e.message })
  }
}