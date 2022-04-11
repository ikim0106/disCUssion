/*
References:
1. https://stackoverflow.com/questions/10570286/check-if-string-contains-url-anywhere-in-string-using-javascript
2. https://stackoverflow.com/questions/44879969/mongoose-how-to-exclude-id-from-populated
3. https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
4. https://love2dev.com/blog/javascript-remove-from-array/

Notes on functions:
send handles the message sending from the ChatBox component. It updates the database with the message and scans for any URLs within the message for any possible embeds
fetch gets all the messages with the corresponding chat ID.
*/

const messageSchema = require('../databaseSchema/messageSchema')
const userSchema = require('../databaseSchema/userSchema')
const chatSchema = require('../databaseSchema/chatSchema')
const asyncHandler = require('express-async-handler')

const send = asyncHandler(async(req, res)=> {
   const {msg, id} = req.body

   if(!msg||!id){
      res.status(400)
      res.message('no message or id provided')
      return res
   }

   let linkRegex =  new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?")
   let containsLink = linkRegex.test(msg)
   console.log('contains link', containsLink)

   let newMsg = {
      sender: req.loggedInUser._id,
      send_in: id,
      contains_link: containsLink,
      message: msg
   }

   let sendMessage = await messageSchema.create(newMsg)
   sendMessage = await sendMessage.populate('sender', 'displayName avatar')
   sendMessage = await sendMessage.populate('send_in')
   sendMessage = await userSchema.populate(sendMessage, {
      path: 'send_in.users',
      select: 'displayName avatar email'
   })
   await chatSchema.findByIdAndUpdate(id, {
      last_message: sendMessage
   })

   if(!sendMessage) {
      res.status(400)
      res.message('sending message failed')
      return res
   }
   res.status(200)
   res.json(sendMessage)
   return res
})

const fetch = asyncHandler(async(req,res)=> {
   let allMessages = await messageSchema.find({
      send_in: req.params.id
   })
   .populate('sender', 'displayName avatar email')
   .populate('send_in')

   if(!allMessages) {
      res.status(400)
      res.message('no messages fetched')
      return res
   }
   res.status(200)
   res.json(allMessages)
   // return res
})

module.exports = {send, fetch}