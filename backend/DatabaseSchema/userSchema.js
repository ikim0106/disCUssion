/*
references
1. https://stackfame.com/mongodb-chat-schema-mongoose-chat-schema-chat-application
2. https://mongoosejs.com/docs/guide.html
3. https://github.com/jaewonhimnae/react-chat/blob/5316520881ac1101ae11f9b6c5ba3f5852aa9867/server/models/Chat.js

Reference 1 and 2 was used as learning material.
The structure and some code from this schema was copied from resource 4 and modified to fit the project.
This is a model to illustrate a user. It contains the traditional elements of a user in most chat applications. 
*/

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
   displayName: {type: String, trim: true, required: true},
   is_admin: {type: Boolean, default: false},
   email: {type: String, required: true, unique: true},
   pw: {type: String, required: true},
   verified: {type: Boolean, required: true, default: false},
   avatar: {type: String,
      default: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-avatar-user-experience-flatart-icons-outline-flatarticons.png"},
},
{
   timestamps: true
})

userSchema.methods.checkPw = async (pw) => {
   return (toString(this.pw) == toString(pw)) //some json string issue ㅡ.ㅡ
}

let userModel = mongoose.model('userModel', userSchema)
module.exports = userModel