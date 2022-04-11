/*
References
1. https://javascript.hotexamples.com/zh/examples/%40pusher.chatkit-server/-/createUser/javascript-createuser-function-examples.html
2. https://www.freecodecamp.org/news/building-a-modern-chat-application-with-react-js-558896622194/
3. https://stackoverflow.com/questions/71108432/want-to-add-group-chat-functionality-in-my-chat-application-using-react-native-g
4. https://mongoosejs.com/docs/populate.html#field-selection

All of these resources have been used as learning material.
All of the routes in this file contain lines of code that may look very similar to the ones in the references, but almost none were directly copied.
*/

const chatSchema = require('../databaseSchema/chatSchema')
const userSchema = require('../databaseSchema/userSchema')
const messageSchema = require('../databaseSchema/messageSchema')
const asyncHandler = require('express-async-handler')
const router = require('express').Router()
const {getLoggedinUser} = require('../middleware/logMiddleware')
const {
   discuss,  
   makeGroup, 
   addToGroup,
   removeFromGroup
} = require('../controllers/chat')

router.get('/', getLoggedinUser, asyncHandler(async(req, res) => {
   let currentUserID = req.loggedInUser._id
   let currentUser = await chatSchema.find({users: {$elemMatch: {$eq: currentUserID}}})
      .populate('users', '-pw')
      .populate('manager', '-pw')
      .populate('last_message')
      .sort({updatedAt: -1}) //sort from new to old PMs
   currentUser = await userSchema.populate(currentUser,  {
      path: "last_message.sender",
      select: "displayName email avatar is_admin"
   })
   if(currentUser!=undefined && currentUser.length>0) {
      // console.log('currentuser', currentUser)
      res.status(200)
      res.send(currentUser)
   }
   else {
      // console.log('invalid userID')
      res.status(400)
      res.send('invalid userID')
      throw Error('invalid userID')
   }
   // const currentUser = chatSchema.find({})
   // console.log('currensUserID', bruh.loggedInUser)
}))
router.post('/', getLoggedinUser, discuss)
router.route('/makeGroup').post(getLoggedinUser, makeGroup)
router.route('/addToGroup').post(getLoggedinUser, addToGroup)
router.route('/removeFromGroup').post(getLoggedinUser, removeFromGroup)

module.exports = router