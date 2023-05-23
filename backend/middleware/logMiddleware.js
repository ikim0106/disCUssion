const userSchema = require('../DatabaseSchema/userSchema')
const ObjectId = require('mongoose').Types.ObjectId
const asyncHandler = require('express-async-handler')

const getLoggedinUser = asyncHandler(async (req, res, next) => {
   // console.log('req.headers', req.headers)
   let header = req.headers.authorization
   if(header && header.startsWith('userid')) {
      let userID = header.replace('userid ', '') //extract user id from header
      if (!userID || !userID==='') {
         console.log('no userID provided')
         res.status(401)
         res.send('error extracting userid')
         return res
      }
      let query = {_id: new ObjectId(userID)}
      const exists = await userSchema.find(query)
      // console.log(exists)
      if(exists) {
         req.loggedInUser = await userSchema.findById(userID).select('-pw')
         next() //move onto the next function
      }
      else {
         res.status(401)
         res.send('not an authorized user')
         return res
      }
   }
})

module.exports = {getLoggedinUser}